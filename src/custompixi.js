import { createSprite, createElement as defaultCreateElement } from './pixi/pixiapi';

import NumberSprite from './asprite.js';

function createNumberSprite(textures, number) {
  return new NumberSprite(textures, number);
}

export default function createElement(ctrl) {
  return (tag, texture, data) => {
    switch(tag) {
    case 'number':
      return createNumberSprite(ctrl.data.textures, data.number);
      break;
    default: 
      return defaultCreateElement(tag, texture, data);
    }
  };

}
