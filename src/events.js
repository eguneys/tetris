import { Moves } from './ctrl';

export function bindDocument(ctrl) {
  const unbinds = [];

  const onKeyDown = startMove(ctrl);

  unbinds.push(unbindable(document, 'keydown', onKeyDown));

  return () => { unbinds.forEach(_ => _()); };

}

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function startMove(ctrl) {
  return function(e) {
    switch(e.code) {
    case 'ArrowUp':
      ctrl.move(Moves.rotate);
      break;
    case 'ArrowDown':
      ctrl.move(Moves.down);
      break;
    case 'ArrowLeft':
      ctrl.move(Moves.left);
      break;
    case 'ArrowRight':
      ctrl.move(Moves.right);
      break;
    default:
      return;
    }
    e.preventDefault();
  };
}
