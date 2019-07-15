import { rows, cols } from './util';

export function defaults() {
  return {
    speed: 1,
    width: 640,
    height: 480,
    rows: rows,
    cols: cols,
    tiles: {},
    removeRows: [],
    tileSize: 20
  };
}
