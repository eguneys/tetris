import { pos2key, getShape, shapeToPosMap, randomShapeKey } from './util';

function now() { return Date.now(); }

function addPos(pos1, pos2) {
  return [pos1[0] + pos2[0],
          pos1[1] + pos2[1]];
}

export default function Controller(state, redraw) {
  const d = this.data = state;

  const blockTiles = (shape, x, y) => {
    return shapeToPosMap(shape).map(pos => {
      pos = addPos(pos, [x, y]);
      const key = pos2key(pos);

      return {
        key
      };      
    });
  };

  const placeBlock = () => {
    if (this.data.current) {
      this.data.current.tiles = blockTiles(
        this.data.current.shape,
        this.data.current.x,
        this.data.current.y);
    }
  };

  this.nextBlock = () => {
    const top = 0;
    const middle = 8;
    const shape = getShape(randomShapeKey());
    this.data.current = {
      shape,
      x: middle,
      y: top
    };
  };

  this.fallBlock = () => {
    this.data.current.y++;
  };

  this.maybeNextBlock = () => {
    if (this.data.current) {
    } else {
      this.nextBlock();
    }
  };

  this.maybeFallBlock = (() => {
    let lastUpdate = 0;

    return (delta) => {
      lastUpdate += delta;
      if (lastUpdate >= (1000 * this.data.speed / 16)) {
        this.fallBlock();
        lastUpdate = 0;
      }
    };
  })();

  this.update = (delta) => {
    this.maybeNextBlock();
    this.maybeFallBlock(delta);
    placeBlock();
  };
}
