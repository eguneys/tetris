import { Moves } from './ctrl';

import { configure } from './config';

export default function start(ctrl) {

  return {
    set(config) {
      return anim((state) => configure(state, config), ctrl.data);
    },
    move(dir) {
      return anim((state) => {
        switch (dir) {
        case 'up':
          ctrl.move(Moves.rotate);
          break;
        case 'down':
          ctrl.move(Moves.down);
          break;
        case 'left':
          ctrl.move(Moves.left);
          break;
        case 'right':
          ctrl.move(Moves.right);
          break;

        }
      }, ctrl.data);
    }
  };
}

function anim(mutation, state) {
  const result = mutation(state);
  return result;
}
