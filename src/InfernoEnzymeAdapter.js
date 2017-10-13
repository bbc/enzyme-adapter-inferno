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

function upperCasefirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

      simulateEvent(node, event) {
        node.props[`on${upperCasefirst(event)}`]();
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
