import * as PIXI from 'pixi.js';
import { init } from './pixi/snabbpixi';
import { makePixiApi } from './pixi/pixiapi';

import createElement from './custompixi';

import sprites from './sprites';

import * as events from './events';

import { configure } from './config';
import { defaults } from './state'; 
import makeCtrl from './ctrl';
import view from './view';

export function app(element, config) {
  let state = defaults();
  configure(state, config || {});

  const app = new PIXI.Application({
    width: state.width,
    height: state.height
  });

  element.appendChild(app.view);

  app.loader
    .add("")
    .load(() => {

      let patch, vnode, ctrl;
      
      function redraw() {
        vnode = patch(vnode, view(ctrl));
      }

      const textures = sprites();

      state.textures = textures;
      state.redraw = redraw;

      ctrl = new makeCtrl(state, redraw);

      patch = init([], makePixiApi(createElement(ctrl)));

      events.bindDocument(ctrl);

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
