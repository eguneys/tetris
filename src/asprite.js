import * as PIXI from 'pixi.js';

function digitize(number) {
  const res = [];
  while (number > 0) {
    res.push(number % 10);
    number = (number - (number % 10)) / 10;
  }
  return res.reverse();
}

function Pool(fn, amount) {

  const pool = [];

  for (var i = 0; i < amount; i++) {
    pool.push(fn());
  }

  this.borrow = () => {
    if (pool.length === 0) {
      throw new Error("Borrowed on empty pool.");
    }

    return pool.pop();
  };

  this.giveBack = (item) => {
    pool.push(item);
  };
}

export default class NumberSprite extends PIXI.Container {

  constructor(textures, number) {
    super();

    this.textures = textures;
    this.number = number;

    this.sprites = [
      new PIXI.Sprite(textures['number0']),
      new PIXI.Sprite(textures['number1']),
      new PIXI.Sprite(textures['number2']),
      new PIXI.Sprite(textures['number3']),
      new PIXI.Sprite(textures['number4'])
    ];

    this.sprites.forEach((_, i) => {
      _.alpha = 0;
      _.x = (this.sprites.length-i) * 20;
      this.addChild(_);
    });

    this.updateChildren();
  }

  setData(data) {
    if (this.number !== data.number) {
      this.number = data.number;
      this.updateChildren();
    }
  }

  updateChildren() {
    const digits = digitize(this.number);

    this.sprites.forEach(_ => _.alpha = 0);

    digits.forEach((digit, i) => {
      const sprite = this.sprites[digits.length - i];
      sprite.alpha = 1;
      sprite.texture = this.textures['number' + digit];
    });

  }
}
