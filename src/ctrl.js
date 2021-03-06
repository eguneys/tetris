import { key2pos, pos2key, getShape, unrotateShape, rotateShape, shapeToPosMap, randomShapeKey } from './util';

import * as util from './util';

function now() { return Date.now(); }

function addPos(pos1, pos2) {
  return [pos1[0] + pos2[0],
          pos1[1] + pos2[1]];
}

function outOfBounds(pos, cols, rows) {
  return pos[0] < 0 || pos[0] >= cols || pos[1] >= rows;
}

function outOfBottom(pos, cols, rows) {
  // return pos[0] < 0 || pos[1] < 0 ||
  //   pos[0] >= cols || pos[1] >= rows;
  return pos[0] >= cols || pos[1] >= rows;
}

function outOfTop(pos) {
  return pos[1] < 0;
}

export const Moves = {
  rotate: 'rotate',
  down: 'down',
  left: 'left',
  right: 'right'
};

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
        key,
        color: shape.color
      };      
    }).filter(_ => !!_);
  };

  const placeBlock = () => {
    if (this.data.current) {
      this.data.current.tiles = blockTiles(
        this.data.current.shape,
        this.data.current.x + this.data.current.rotateX,
        this.data.current.y + this.data.current.rotateY);
    }
  };

  this.nextBlock = () => {
    const top = -2;
    const middle = this.data.cols / 2 - 2;
    const shape = this.data.next;

    this.data.next = getShape(randomShapeKey());

    this.data.current = {
      shape,
      x: middle,
      y: top,
      rotateX: 0,
      rotateY: 0
    };
    placeBlock();
  };

  const ensureDelay = (start, fn, delay = 1000) => {
    if (now() - start > delay) {
      fn();
    }
  };

  this.move = (move) => {
    if (this.data.gameover > 0) {
      ensureDelay(this.data.gameover, () => {
        this.shouldResetGame = true;
      });
    } else {
      this.userMove = move;
    }
  };

  this.resetGame = () => {
    this.data.tiles = {};
    this.data.level = 1;
    this.data.score = 0;
    this.data.current = undefined;
    this.data.next = getShape(randomShapeKey());
    this.data.gameover = 0;
  };

  this.getSpeed = () => {
    const levelFactor = 1;

    return this.data.speed / (this.data.level * levelFactor);
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
      if (outOfBounds(pos, this.data.cols, this.data.rows)) {
        return true;
      }
      if (overlapCurrent(tile.key)) {
        return true;
      }
    }
    return false;
  };

  const fallBlockBase = () => {
    this.data.current.y++;
  };

  const undoFallBlockBase = () => {
    this.data.current.y--;
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

  const rotateBlockBase = () => {
    this.data.current.shape = rotateShape(this.data.current.shape);
    tmpCommitBlock = this.commitBlock;
    this.commitBlock = false;
  };

  const undoRotateBlockBase = () => {
    this.data.current.shape = unrotateShape(this.data.current.shape);
    this.commitBlock = tmpCommitBlock;
  };

  const rotateBlock = () => {
    if (!this.data.current)
      return;
    rotateBlockBase();
    this.data.current.rotateY = 0;
    this.data.current.rotateX = 0;
    placeBlock();
    if (checkCollision()) {
      let fixed = false;
      
      for (var y = 0; y <= 2; y++) {
        this.data.current.rotateX = 0;
        this.data.current.rotateY = -y;
        if (!fixed) {
          placeBlock();
          if ((fixed = !checkCollision())) {
            break;
          }
        }

        if (!fixed) {
          placeBlock();

          for (var i = 0; i < 2; i++) {
            this.data.current.rotateX++;
            placeBlock();
            if ((fixed = !checkCollision())) {
              break;
            }
          }
        }
        if (!fixed) {
          this.data.current.rotateX = 0;
          placeBlock();
          for (i = 0; i < 2; i++) {
            this.data.current.rotateX--;
            placeBlock();
            if ((fixed = !checkCollision())) {
              break;
            }
          }
        }
        if (fixed) break;
      }

      // if (!fixed) {
      //   throw new Error("invalid rotate collision");
      // }
      if (!fixed) {
        console.log('here');
        this.data.current.rotateY = 0;
        this.data.current.rotateX = 0;
        undoRotateBlockBase();
        placeBlock();
      }
    }
  };

  let tmpCommitBlock;

  const moveBlockBase = (v) => {
    this.data.current.x += v[0];
    this.data.current.y += v[1];
    tmpCommitBlock = this.commitBlock;
    this.commitBlock = false;
  };

  const undoMoveBlockBase = (v) => {
    this.data.current.x -= v[0];
    this.data.current.y -= v[1];
    this.commitBlock = tmpCommitBlock;
  };

  const moveBlock = (v) => {
    if (!this.data.current)
      return;

    moveBlockBase(v);
    placeBlock();
    if (checkCollision()) {
      undoMoveBlockBase(v);
      placeBlock();
    }
  };

  const fastCommit = () => {
    if (!this.data.current)
      return;

    moveBlockBase([0, 1]);
    placeBlock();
    if (checkCollision()) {
      tmpCommitBlock = true;
    }
    undoMoveBlockBase([0, 1]);
    placeBlock();
  };

  const commitBlock = () => {
    if (this.data.current.tiles.length === 0) {
      this.data.gameover = now();
    }

    for (var tile of this.data.current.tiles) {
      this.data.tiles[tile.key] = tile;
    }

    this.data.current = undefined;
    this.commitBlock = false;
  };

  const removeBlocks = () => {
    for (var row of util.allRows()) {
      const cols = util.allCols(row);

      const isFull = cols.every(pos => {
        var key = pos2key(pos);
        return !!this.data.tiles[key];
      });

      if (isFull) {
        this.data.removeRows.push(row);
      }
    }

    const removeRows = this.data.removeRows.slice();

    while(removeRows.length > 0) {

      const fallenRow = removeRows[removeRows.length - 1];
      const fallTo = fallenRow;
      const fallAmount = 1;
      
      removeRows.pop();
      for (var i in removeRows) {
        removeRows[i]++;
      }

      const cols = util.allCols(fallenRow);
      for (var pos of cols) {
        const key = pos2key(pos);
        delete this.data.tiles[key];
      }

      const sortedTiles = Object.keys(this.data.tiles)
            .sort((k1, k2) => {
              const p1 = key2pos(k1),
                    p2 = key2pos(k2);
              return p2[1] - p1[1];
            });

      for (var key of sortedTiles) {
        const pos = key2pos(key);
        if (pos[1] < fallenRow) {
          const toPos = addPos(pos, [0, fallAmount]);
          const toKey = pos2key(toPos);
          this.data.tiles[toKey] = {
            key: toKey,
            color: this.data.tiles[key].color,
            anim: key
          };
          this.data.tiles[key] = undefined;
          delete this.data.tiles[key];
        }
      }
    }
  };


  const withDelay = (fn, delay, updateFn) => {
    let lastUpdate = 0;

    return (delta) => {
      lastUpdate += delta;
      if (lastUpdate >= (delay / 16)) {
        fn();
        lastUpdate = 0;
      } else {
        if (updateFn)
          updateFn(lastUpdate / (delay / 16));
      }
    };
  };

  const maybeFallBlock = (() => {
    let lastSpeed = this.getSpeed();
    let delayFn;
    return (delta) => {
      if (!delayFn || lastSpeed !== this.getSpeed()) {
        lastSpeed = this.getSpeed();
        delayFn = withDelay(fallBlock,
                            1000 * lastSpeed);
      }
      delayFn(delta);
    };
  })();

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
      this.data.addScore += 5;
      this.nextBlock();
    }
  };

  const maybeUsermove = () => {
    switch (this.userMove) {
    case Moves.rotate:
      rotateBlock();
      break;
    case Moves.left:
      moveBlock([-1, 0]);
      break;
    case Moves.right:
      moveBlock([1, 0]);
      break;
    case Moves.down:
      moveBlock([0, 1]);
      fastCommit();
      break;
    default:
    }
    this.userMove = undefined;
  };

  const maybeRemoveBlocks = () => {
    if (!this.data.current) {
      removeBlocks();
    }
  };

  const maybeClearRemovedBlocks = (() => {
    let delayFn;
    
    return (delta) => {
      if (this.data.removeRows.length > 0) {
        if (!delayFn) {
          delayFn = withDelay(() => {
            for (var key of Object.keys(this.data.tiles)) {
              delete this.data.tiles[key].anim;
            }
 
            this.data.addScore += this.data.removeRows.length * 10;
            this.data.removeRows = [];
          }, 300, (progress) => {
            this.animProgress = progress;
          });
        }
        delayFn(delta);
      }
    };
  })();

  const maybeUpdateScore = withDelay(() => {
    this.data.score += this.data.addScore;
    this.data.addScore = 0;
  }, 500);

  const maybeUpdateLevel = withDelay(() => {
    this.data.level++;
  }, 5000);

  const maybeEndGame = () => {
    if (this.data.gameover > 0) {
      console.log('game over');
    }
  };

  const maybeResetGame = () => {
    if (this.shouldResetGame) {
      this.shouldResetGame = false;
      this.resetGame();
    }
  };

  const maybePlayGame = (delta) => {
    maybeNextBlock();
    maybeFallBlock(delta);
    maybeCommitBlock(delta);
    maybeRemoveBlocks();
    maybeClearRemovedBlocks(delta);
    maybeUpdateLevel(delta);
    maybeUpdateScore(delta);
    maybeEndGame();
    maybeUsermove();
  };

  this.update = (delta) => {
    if (this.data.gameover > 0) {
      maybeResetGame(delta);
    } else {
      maybePlayGame(delta);
    }
  };
}
