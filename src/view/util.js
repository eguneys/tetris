import { h } from '../pixi/snabbpixi';

export function renderBackground(ctrl) {
  return h('sprite', {
    texture: ctrl.data.textures.background,
    width: ctrl.data.width,
    height: ctrl.data.height
  });
}
