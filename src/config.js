import { initialFen, read as fenRead } from './fen';
import { getShape } from './util';

export function configure(state, config) {
  merge(state, config);

  if (!config.fen) {
    config.fen = initialFen;
  }

  if (config.fen) {
    const { tiles, next } = fenRead(config.fen);
    state.tiles = tiles;
    state.next = getShape(next);
  }

}

function merge(base, extend) {
  for (var key in extend) {
    if (isObject(base[key]) && isObject(extend[key])) {
      merge(base[key], extend[key]);
    } else {
      base[key] = extend[key];
    }
  }
}

function isObject(o) {
  return typeof o === 'object';
}
