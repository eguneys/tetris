import { h } from './pixi/snabbpixi';

import { pos2key, key2pos } from './util';

function renderTile(ctrl, key, tile) {
  const width = ctrl.data.tileSize,
        height = ctrl.data.tileSize;
  let pos = key2pos(key),
        x = pos[0] * width,
        y = pos[1] * height;

  const anim = tile.anim ? key2pos(tile.anim) : null;

  if (anim) {
    y = anim[1] * height;
    y -= -(pos[1] - anim[1]) * height * ctrl.animProgress;
  }

  return h('sprite', {
    texture: ctrl.data.textures['tile' + tile.color],
    width, height, x, y });
}

function renderCurrent(ctrl) {
  const cur = ctrl.data.current;

  if (!cur) {
    return [];
  }

  const content = cur.tiles.map(tile =>
    renderTile(ctrl, tile.key, tile)
  );

  return content;
}

function renderTiles(ctrl) {
  const tiles = ctrl.data.tiles;

  return Object.keys(tiles).map(key => renderTile(ctrl, key, tiles[key]));
}

function renderRemoveRow(ctrl, row) {
  const attrs = {
    texture: ctrl.data.textures.whiteBackground,
    x: (ctrl.data.cols / 2) * ctrl.data.tileSize,
    y: row * ctrl.data.tileSize,
    anchor: { x: 0.5, y: 0.5 },
    width: ctrl.data.cols * ctrl.data.tileSize,
    height: ctrl.data.tileSize
  };

  if (ctrl.animProgress) {
    const scale = (1 + (0.1 * ctrl.animProgress));
    attrs.width *= scale;
    attrs.height *= scale;
    attrs.alpha = 0.2 + (0.8 * (1 - ctrl.animProgress));
  }
  return h('sprite', attrs);
}

function renderRemoveRows(ctrl) {
  const rows = ctrl.data.removeRows;

  return rows.map(_ => renderRemoveRow(ctrl, _));
}

function renderPlayBackground(ctrl) {
  return h('sprite', {
    texture: ctrl.data.textures.playBackground,
    width: ctrl.data.cols * ctrl.data.tileSize,
    height: ctrl.data.rows * ctrl.data.tileSize
  });
}

function renderScoreBackground(ctrl, width, height) {
  return h('sprite', {
    texture: ctrl.data.textures.scoreBackground,
    width,
    height
  });  
}

function renderPlay(ctrl) {
  var middle = (ctrl.data.width / 2
                - (ctrl.data.cols * ctrl.data.tileSize / 2));
  var content = [
    renderPlayBackground(ctrl),
    ...renderTiles(ctrl),
    ...renderRemoveRows(ctrl),
    ...renderCurrent(ctrl)
  ];
  return h('container', {
    x: middle,
    y: ctrl.data.height - (ctrl.data.rows + 1) * ctrl.data.tileSize
  }, content);
}

function renderScoreLabel(ctrl, width, height) {
  return h('sprite', {
    texture: ctrl.data.textures['scoreLabel'],
    width,
    height,
    y: - height * 0.1
  });
}

function renderScoreNumbers(ctrl, width, height) {
  return h('number', {
    number: ctrl.data.score,
    width,
    height,
    y: height * 0.25
  });  
}

function renderScore(ctrl) {
  const width = (ctrl.data.cols - 2) * ctrl.data.tileSize,
        height = 3 * ctrl.data.tileSize,
        middle = (ctrl.data.width / 2 -
                  width / 2);
  var content = [
    renderScoreBackground(ctrl, width, height),
    renderScoreLabel(ctrl, width, height),
    renderScoreNumbers(ctrl, width, height)
  ];

  return h('container', {
    x: middle,
    y: ctrl.data.tileSize * 0.5,
  }, content);
}

function renderBackground(ctrl) {
  return h('sprite', {
    texture: ctrl.data.textures.background,
    width: ctrl.data.width,
    height: ctrl.data.height
  });
}

export default function(ctrl) {
  var content = [
    renderBackground(ctrl),
    renderScore(ctrl),
    renderPlay(ctrl)
  ];

  return h('container', content);
}
