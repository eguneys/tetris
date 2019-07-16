import { h } from '../pixi/snabbpixi';

import { pos2key, key2pos } from '../util';

import * as util from '../util';

import { renderBackground } from './util';

function renderTileBase(ctrl, color, x, y, width, height) {
  return h('sprite', {
    texture: ctrl.data.textures['tile' + color],
    width, height, x, y });
}

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

  return renderTileBase(ctrl, tile.color,
                        x, y, width, height);
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

  var top = ctrl.data.height - (ctrl.data.rows + 1) * ctrl.data.tileSize;
  var content = [
    renderPlayBackground(ctrl),
    ...renderTiles(ctrl),
    ...renderRemoveRows(ctrl),
    ...renderCurrent(ctrl)
  ];
  return h('container', {
    x: middle,
    y: top
  }, content);
}

function renderScoreLabel(ctrl, x, y, width, height) {
  return renderLabel(ctrl,
                     x,
                     y,
                     width,
                     height,
                     ctrl.data.textures['scoreLabel'],
                    );
}

function renderLabel(ctrl, x, y, width, height, texture) {
  return h('sprite', {
    texture,
    width,
    height,
    x,
    y
  });
}

function renderScoreNumbers(ctrl, x, y, width, height) {

  return h('number', {
    number: ctrl.data.score,
    x, y,
    width,
    height,
  });  
}

function renderScore(ctrl) {
  const width = (ctrl.data.cols - 2) * ctrl.data.tileSize,
        height = 3 * ctrl.data.tileSize,
        middle = (ctrl.data.width / 2 -
                  width / 2);
  var content = [
    renderScoreBackground(ctrl, width, height),
    renderScoreLabel(ctrl, 
                     12 + middle - width / 2,
                     10 - height * 0.1,
                     width * 0.6,
                     height * 0.5),
    renderScoreNumbers(ctrl,
                       -4 + middle - width / 2,
                       height * 0.5,
                       width * 0.6,
                       height * 0.5)
  ];

  return h('container', {
    x: middle,
    y: ctrl.data.tileSize * 0.5,
  }, content);
}

function renderNextTile(ctrl) {
  if (!ctrl.data.next) {
    return null;
  }

  const content = util.shapeToPosMap(ctrl.data.next).map(pos =>
    renderTile(ctrl, pos2key(pos), ctrl.data.next)
  );

  return h('container', {
    x: - ctrl.data.tileSize * 0.25,
    y: ctrl.data.tileSize * 0.75,
    scale: { x: 0.75, y: 0.75 }
  }, content);
}

function renderNext(ctrl) {
  const width = ctrl.data.tileSize * 3.5,
        height = width,
        right = ctrl.data.width - width * 1.07,
        top = ctrl.data.height - (ctrl.data.rows) * ctrl.data.tileSize;

  var content = [
    renderScoreBackground(ctrl, width, height),
    renderLabel(ctrl,
                0,
                - height * 0.4,
                width, height * 0.5,
                ctrl.data.textures['nextLabel']),
    renderNextTile(ctrl)
  ];

  return h('container', {
    x: right,
    y: top
  }, content);
}

function renderNumbers(ctrl, numbers, x, y, width, height) {
  return h('number', {
    number: numbers,
    x, y,
    width,
    height,
  });
}

function renderLevel(ctrl) {
  const width = ctrl.data.tileSize * 3.5,
        height = width,
        right = width * 0.07,
        top = ctrl.data.height - (ctrl.data.rows - 10) * ctrl.data.tileSize;

  var content = [
    renderScoreBackground(ctrl, width, height),
    renderLabel(ctrl,
                0,
                - height * 0.4,
                width, height * 0.5,
                ctrl.data.textures['levelLabel']),
    renderNumbers(ctrl,
                  ctrl.data.level,
                  -width * 0.4,
                  0,
                  width,
                  height)
  ];

  return h('container', {
    x: right,
    y: top
  }, content); 
}

export function render(ctrl) {
  var content = [
    renderBackground(ctrl),
    renderScore(ctrl),
    renderNext(ctrl),
    renderLevel(ctrl),
    renderPlay(ctrl)
  ];

  return h('container', content);  
}
