export const cols = 10;
export const rows = 20;

export const allPos = (function() {
  const res = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      res.push([j, i]);
    }
  }
  return res;
})();

export function pos2key(pos) {
  return pos[1] * cols + pos[0];
};

export function key2pos(key) {
  return [key % cols, Math.floor(key / cols)];
}

export function shapeToPosMap(shape) {
  return shape.shape[shape.rotation];
}

export function rotateShape(shape) {
  const rotation = (shape.rotation + 1) % shape.shape.length;
  return {
    shape: shape.shape,
    rotation
  };
}

export function getShape(key) {
  const shape = allShapes[key];
  const rotation = 0;
  
  return {
    shape,
    rotation
  };
}

function readShape(shape) {
  const poss = [];
  const lines = shape.split('\n');
  lines.map((line, row) => {
    for (var col = 0; col < line.length; col++) {
      if (line[col] === '.') {
        poss.push([row, col]);
      }
    }
  });
  return poss;
}

export const randomShapeKey = () => allShapeKeys[Math.floor(Math.random() * allShapeKeys.length)];

export const allShapeKeys = ['l', 'r', 'i', 's', 'o', 't'];

export const allShapesString = {
  'l': [`
.
.
..
`],
  'r': [`
 .
 .
..
`],
  'i': [`
.
.
.
.
`],
  's': [`
.
..
 .
`],
  'o': [`
..
..
`],
  't': [`
...
 .
`]
};

export const allShapes = (function() {
  const res = {};
  for (var key of Object.keys(allShapesString)) {
    var shape = allShapesString[key];
    res[key] = shape.map(readShape);
  }
  return res;
})();
