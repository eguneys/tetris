import { pos2key } from './util';

const colors = { g: 'green', r: 'red', b: 'blue', y: 'yellow' };

const tilePattern = /(g|r|b|y|\d+)/;

// 10/10/g8b/..
//
//
export function read(fen) {
  const tiles = {};

  fen = fen.split(' ');

  const tilesStr = fen[0],
        next = fen[1];

  tilesStr.split('/').forEach((line, row) => {
    let col = 0;
    while (line !== '') {
      const capture = line.match(tilePattern)[1];
      line = line.slice(capture.length, line.length);
      switch (capture) {
      case 'g':
      case 'r':
      case 'b':
      case 'y':
        const pos = [col, row];
        const key = pos2key(pos);
        tiles[key] = {
          key,
          color: colors[capture]
        };
        col++;
        break;
      default:
        const spaces = parseInt(capture);
        col += spaces;
      }
    }
  });

  return { tiles, next };
}
