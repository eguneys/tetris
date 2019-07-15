import * as PIXI from 'pixi.js';

function createContainer() {
  return new PIXI.Container();
}

function createSprite(texture) {
  return new PIXI.Sprite(texture);
}

function createElement(tag, texture) {
  switch (tag) {
  case 'sprite':
    return createSprite(texture);
  case 'container':
    return createContainer();
  default:
    throw new Error('Unknown Pixi element tag ' + tag);
  }
}

function parentNode(child) {
  return child.parent;
}

function removeChild(node, child) {
  node.removeChild(child);
}

function addChild(node, child) {
  node.addChild(child);
}

function setDataContent(elm, data) {
  elm.x = data.x || 0;
  elm.y = data.y || 0;
  if (data.width) elm.width = data.width;
  if (data.height) elm.height = data.height;
}

export const pixiApi = {
  createElement,
  parentNode,
  addChild,
  removeChild,
  setDataContent
};

export default pixiApi;
