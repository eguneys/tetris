import * as PIXI from 'pixi.js';
import * as util from './util';

export default function sprites() {
  const tss = {};

  const colors = {
    blue: '#1f3a93',
    orange: '#e87e04',
    cyan: '#81cfe0',
    red: '#cf000f',
    green: '#1e824c',
    yellow: '#f0ff00',
    purple: '#4d13d1'
  };

  Object.values(util.colors).forEach(color => {
    tss['tile' + color] = tileTexture(colors[color]);
  });

  tss['background'] = bgTexture('#ccc');

  tss['playBackground'] = bgTexture('#444');

  tss['scoreBackground'] = bgTexture('#999');

  tss['whiteBackground'] = bgTexture('#fff');

  tss['scoreLabel'] = labelTexture('SCORE');

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(no =>
    tss['number' + no] = labelTexture(no)
  );

  return tss;
}

const labelTexture = (label) => {
  return withCanvasTexture(256, 100, (w, h, canvas, ctx) => {
    // ctx.fillStyle = 'black';
    // ctx.fillRect(0, 0, w, h);
    ctx.font = '20pt Roboto';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, 50);
    
    return canvas;
  });
};

const bgTexture = (color) => {
  return withCanvasTexture(256, 256, (w, h, canvas, ctx) => {

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    return canvas;
  });
};

const tileTexture = color => {
  return withCanvasTexture(256, 256, (w, h, canvas, ctx) => {
    const border = 10;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 10;
    ctx.fillStyle = color;
    ctx.fillRect(border, border, w - border * 2, h - border * 2);
    return canvas;
  });
};

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(width, height, canvas, canvas.getContext('2d'));
  const texture = PIXI.Texture.from(canvas);
  return texture;
}
