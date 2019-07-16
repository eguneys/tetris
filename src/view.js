import { h } from 'snabbpixi';

import { render as renderGameOver } from './view/over';
import { render as renderGamePlay } from './view/play';

export default function(ctrl) {
  let content;

  if (ctrl.data.gameover) {
    content = [renderGameOver(ctrl)];
  } else {
    content = renderGamePlay(ctrl);
  }

  return h('container', content);
}
