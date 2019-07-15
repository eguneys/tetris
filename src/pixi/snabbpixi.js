import vnode from './vnode';
import pixiApi from './pixiapi';

import * as is from './is';

export {h} from './h';

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }

function sameVnode(vnode1, vnode2) {
  return vnode1.sel === vnode2.sel &&
    vnode1.texture === vnode2.texture;
}

function isVnode(vnode) {
  return vnode.sel !== undefined;
}

export function init(modules) {
  const api = pixiApi;

  function emptyNodeAt(app) {
    return vnode('app', {}, [], app);
  }

  function createElm(vnode) {
    let i;
    let children = vnode.children,
        sel = vnode.sel,
        texture = vnode.texture,
        data = vnode.data;

    const tag = sel;
    const elm = vnode.elm = api.createElement(tag, texture);

    api.setDataContent(elm, data);

    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i];
        if (ch !== null) {
          api.addChild(elm, createElm(ch));
        }
      }
    }

    return vnode.elm;
  }

  function addVnodes(parentElm,
                     vnodes,
                     startIdx,
                     endIdx) {
    for (;startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch !== null) {
        api.addChild(parentElm, createElm(ch));
      }
    }
  }

  function updateChildren(parentElm,
                          oldCh,
                          newCh) {
    let oldStartIdx = 0, newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];


    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx];
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[++oldEndIdx];
        newEndVnode = newCh[++newEndIdx];        
      }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        addVnodes(parentElm, newCh, newStartIdx, newEndIdx);
      } else {
        
      }
    }
  }

  function patchVnode(oldVnode, vnode) {
    const elm = vnode.elm = oldVnode.elm;
    let oldCh = oldVnode.children;
    let ch = vnode.children;
    if (oldVnode === vnode) return;

    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch);
    } else if (isDef(ch)) {
      addVnodes(elm, ch);
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh);
    } else {
    }
    api.setDataContent(elm, vnode.data);
  }
  
  return function patch(oldVnode, vnode) {
    let elm;
    
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode);
    } else {
      elm = oldVnode.elm;
      createElm(vnode);

      api.addChild(elm, vnode.elm);
    }

    return vnode;
  };
};
