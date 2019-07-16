import { rows, cols } from './util';

export function defaults() {
  return {
    speed: 1,
    width: 360,
    height: 500,
    rows: rows,
    cols: cols,
    level: 1,
    score: 0,
    addScore: 0,
    tiles: {},
    removeRows: [],
    tileSize: 20,
    events: {}
  };
}
