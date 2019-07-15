import { key2pos, pos2key, getShape, shapeToPosMap, randomShapeKey } from './util';

function now() { return Date.now(); }

function addPos(pos1, pos2) {
  return [pos1[0] + pos2[0],
          pos1[1] + pos2[1]];
}

function outOfBottom(pos, cols, rows) {
  // return pos[0] < 0 || pos[1] < 0 ||
  //   pos[0] >= cols || pos[1] >= rows;
  return pos[0] >= cols || pos[1] >= rows;
}

function outOfTop(pos) {
  return pos[0] < 0 || pos[1] < 0;
}

export default function Controller(state, redraw) {
  const d = this.data = state;


  const blockTiles = (shape, x, y) => {
    return shapeToPosMap(shape).map(pos => {
      pos = addPos(pos, [x, y]);
      const key = pos2key(pos);
      if(outOfTop(pos)) {
        return null;
      }
      return {
        key
      };      
    }).filter(_ => !!_);
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
    const top = -2;
    const middle = this.data.cols / 2 - 2;
    const shape = getShape(randomShapeKey());
    this.data.current = {
      shape,
      x: middle,
      y: top
    };
    placeBlock();
  };

  const fallBlockBase = () => {
    this.data.current.y++;
  };

  const undoFallBlockBase = () => {
    this.data.current.y--;
  };

  const checkCollision = () => {
    const data = this.data;
    function overlapCurrent(key) {
      if (data.tiles[key]) {
        return true;
      }
      return false;
    }

    for (var key of Object.keys(this.data.current.tiles)) {
      var tile = this.data.current.tiles[key];
      var pos = key2pos(tile.key);
      if (outOfBottom(pos, this.data.cols, this.data.rows)) {
        return true;
      }
      if (overlapCurrent(tile.key)) {
        return true;
      }
    }
    return false;
  };

  const fallBlock = () => {
    fallBlockBase();
    placeBlock();
    if (checkCollision()) {
      undoFallBlockBase();
      placeBlock();
      this.commitBlock = true;
    }
  };

  const commitBlock = () => {
    for (var tile of this.data.current.tiles) {
      this.data.tiles[tile.key] = tile;
    }

    this.data.current = undefined;
    this.commitBlock = false;
  };


  const withDelay = (fn, delay) => {
    let lastUpdate = 0;

    return (delta) => {
      lastUpdate += delta;
      if (lastUpdate >= (delay / 16)) {
        fn();
        lastUpdate = 0;
      }
    };
  };

  const maybeCommitBlock = (() => {
    let commitFn;
    
    return (delta) => {
      if (this.commitBlock) {
        if (!commitFn) {
          commitFn = withDelay(commitBlock, 500);
        }
        return commitFn(delta);
      } else {
        commitFn = undefined;
        return (() => {})();
      }
    };
  })();

  const maybeNextBlock = () => {
    if (this.data.current) {
    } else {
      this.nextBlock();
    }
  };

  const maybeFallBlock = withDelay(fallBlock,
                                   1000 * this.data.speed);

  this.update = (delta) => {
    maybeNextBlock();
    maybeFallBlock(delta);
    maybeCommitBlock(delta);
  };
}
