import { EnzymeAdapter } from 'enzyme';

function vNodeToRSTTree(vnode) {
  const props = {
    ...vnode.props,
    className: vnode.className,
  };

  if (vnode.children && Array.isArray(vnode.children)) {
    const rendered = vnode.children.map(vNodeToRSTTree);
    return {
      nodeType: 'host',
      type: vnode.type,
      props,
      key: vnode.key,
      ref: vnode.ref,
      instance: null,
      rendered,
    };
  }
  return {
    nodeType: 'host',
    type: vnode.type,
    props,
    key: vnode.key,
    ref: vnode.ref,
    instance: null,
    rendered: null,
  };
}


class InfernoAdapter extends EnzymeAdapter {
  createMountRenderer() {
    let RSTNode = null;

    return {

      render(el, context, callback) {
        if (RSTNode === null) {
          const vnode = el.type();
          const props = {
            ...vnode.props,
            className: vnode.className,
          };
          RSTNode = {
            nodeType: 'host',
            type: vnode.type,
            props,
            key: vnode.key,
            ref: vnode.ref,
            instance: vnode.type,
            rendered: vNodeToRSTTree(vnode),
          };


          if (typeof callback === 'function') {
            callback();
          }
        }
      },

      unmount() {
      },

      getNode() {
        return RSTNode ? RSTNode.rendered : null;
      },

      simulateEvent() {
        throw new Error('simulateEvent not implemeneted yet');
      },

      batchedUpdates(fn) {
        return fn();
      },
    };
  }

  createRenderer(options) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }
}

module.exports = InfernoAdapter;
