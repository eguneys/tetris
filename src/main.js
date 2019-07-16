import * as PIXI from 'pixi.js';
import { init } from 'snabbpixi';
import { makePixiApi } from 'snabbpixi/pixiapi';

import createElement from './custompixi';

import NumberSprite from './asprite';

import sprites from './sprites';

import * as events from './events';

import start from './api';

import { configure } from './config';
import { defaults } from './state'; 
import makeCtrl from './ctrl';
import view from './view';

import * as util from './util';

export function app(element, config) {
  let state = defaults();
  configure(state, config || {});

  let patch, vnode, ctrl;
  
  function redraw() {
    vnode = patch(vnode, view(ctrl));
  }

  ctrl = new makeCtrl(state, redraw);

  const app = new PIXI.Application({
    width: state.width,
    height: state.height
  });

  element.appendChild(app.view);

  app.loader
    .add("")
    .load(() => {

      const textures = sprites();

      state.textures = textures;
      state.redraw = redraw;

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

      util.callUserFunction(state.events.loaded);
    });

  return start(ctrl, redraw);
}
