import * as PIXI from 'pixi.js';

export default function sprites() {
  const tss = {};

  tss['test'] = testTexture;

  return tss;
}

const testTexture = withCanvasTexture(256, 256, (w, h, canvas, ctx) => {
  const border = 10;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, w, h);
  ctx.lineWidth = 10;
  ctx.fillStyle = "#00f6FF";
  ctx.fillRect(border, border, w - border * 2, h - border * 2);
  return canvas;
});

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(width, height, canvas, canvas.getContext('2d'));
  const texture = PIXI.Texture.from(canvas);
  return texture;
}
