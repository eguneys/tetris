import { h } from 'snabbpixi';

import { renderBackground } from './util';

function renderMenuBackground(ctrl, width, height) {
  return h('sprite', {
    texture: ctrl.data.textures['scoreBackground'],
    width,
    height
  });
}


function renderLabel(ctrl, label, x, y, width, height) {
  return h('sprite', {
    texture: ctrl.data.textures[label],
    x, y, width, height
  });
}

function renderHighScoreLabel(ctrl, x, y, width, height) {
  return h('sprite', {
    texture: ctrl.data.textures['highScoreLabel'],
    x, y, width, height
  });
}

function renderHighScore(ctrl, x, y, width, height) {
  return h('number', {
    number: ctrl.data.score,
    x, y, width, height
  });
}


function renderHighScoreMenu(ctrl) {
  const width = ctrl.data.width * 0.8,
        height = ctrl.data.height * 0.5,
        x = ctrl.data.width / 2 - width / 2,
        y = ctrl.data.height * 0.3 - height / 2;
  var content = [
    renderMenuBackground(ctrl, width, height),
    renderHighScoreLabel(ctrl, x, y, width * 0.8, height * 0.3),
    renderHighScore(ctrl, x - width * 0.1, y + height * 0.3, width * 0.6, height * 0.2),
    renderLabel(ctrl, 'playAgainText', x - width * 0.1, y + height * 0.5, width, height * 0.2)
  ];

  return h('container', {
    x, y
  }, content);
}

export function render(ctrl) {
  var content = [
    renderBackground(ctrl),
    renderHighScoreMenu(ctrl)
  ];

  return h('container', content);
}
