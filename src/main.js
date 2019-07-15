import * as PIXI from 'pixi.js';
import { init } from './pixi/snabbpixi';

import sprites from './sprites';

import { configure } from './config';
import { defaults } from './state'; 
import makeCtrl from './ctrl';
import view from './view';

const patch = init([]);

export function app(element, config) {

  let state = defaults();
  configure(state, config || {});

  const app = new PIXI.Application({
    
  });

  element.appendChild(app.view);

  app.loader
    .add("")
    .load(() => {

      let vnode, ctrl;
      
      function redraw() {
        vnode = patch(vnode, view(ctrl));
      }

      const textures = sprites();

      state.textures = textures;
      state.redraw = redraw;

      ctrl = new makeCtrl(state, redraw);

      const blueprint = view(ctrl);
      vnode = patch(app.stage, blueprint);
      
      if (module.hot) {
        module.hot.accept('./ctrl', function() {
          try {
            redraw();
          } catch (e) {
            console.log(e);
            location.reload();
          }
        });
        module.hot.accept('./view', function() {
          try {
            redraw();
          } catch (e) {
            console.log(e);
            location.reload();
          }
        });
      }

      app.ticker.add((delta) => {
        ctrl.update(delta);
        redraw();
      });
    });
}
