import { h } from './pixi/snabbpixi';

import { pos2key, key2pos } from './util';

function renderTile(ctrl, tile) {
  const width = 32,
        height = 32;
  const pos = key2pos(tile.key),
        x = pos[0] * width,
        y = pos[1] * height;

  return h('sprite', {
    texture: ctrl.data.textures.test,
    width, height, x, y });
}

function renderCurrent(ctrl) {
  const cur = ctrl.data.current;

  if (!cur) {
    return [];
  }

  const content = cur.tiles.map(tile =>
    renderTile(ctrl, tile)
  );

  return content;
}

export default function(ctrl) {
  var content = [
    ...renderCurrent(ctrl)
  ];

  return h('container', content);
}
