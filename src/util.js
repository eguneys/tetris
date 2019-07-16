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

export const allCols = (row) => {
  const res = [];
  for (var i = 0; i < cols; i++) {
    res.push([i, row]);
  }
  return res;
};

export const allRows = () => {
  const res = [];
  for (var i = 0; i < rows; i++) {
    res.push(i);
  }
  return res;
};

export function pos2key(pos) {
  return pos[0] + '.' + pos[1];
};

export function key2pos(key) {
  return key.split('.').map(_ => parseInt(_));
}

export function shapeToPosMap(shape) {
  return shape.shape[shape.rotation];
}

export function rotateShape(shape) {
  const rotation = (shape.rotation + 1) % shape.shape.length;
  return {
    shape: shape.shape,
    color: shape.color,
    rotation
  };
}

export function unrotateShape(shape) {
  const rotation = (shape.rotation - 1 + shape.shape.length) % shape.shape.length;
  return {
    shape: shape.shape,
    color: shape.color,
    rotation
  };
}

export function getShape(key) {
  const shape = allShapes[key];
  const rotation = 0;
  
  return {
    shape,
    color: colors[key],
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

export const colors = { l: 'blue', r: 'orange', i: 'cyan', s: 'red', z: 'green', o: 'yellow', t: 'purple'  };

export const allShapeKeys = ['l', 'r', 'i', 's', 'z', 'o', 't'];

export const allShapesString = {
  'l': [`
.
.
..
`, `
  .
...
`, `
..
 .
 .
`,`
...
.
`],
  'r': [`
 .
 .
..
`,`
...
  .
`,`
..
.
.
`,`
.
...
`],
  'i': [`
 .
 .
 .
 .
`,`

....
`,],
  's': [`
.
..
 .
`,`
 ..
..
`],
  'z': [`
 .
..
.
`,`
..
 ..
`],
  'o': [`
..
..
`],
  't': [`
...
 .
`, `
.
..
.
`, `
 .
...
`, `
 .
..
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


export const callUserFunction = (fn) => {
  if (fn) setTimeout(fn, 0);
};
