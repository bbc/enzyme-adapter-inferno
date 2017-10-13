import { EnzymeAdapter } from 'enzyme';
import { throwError } from './util';

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

  if (vnode.children) {
    return {
      nodeType: 'host',
      type: vnode.type,
      props,
      key: vnode.key,
      ref: vnode.ref,
      instance: null,
      rendered: vNodeToRSTTree(vnode.children),
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

function getVnode(type) {
  try {
    return type();
  } catch (err) {
    return new type().render(); // eslint-disable-line new-cap
  }
}

class InfernoAdapter extends EnzymeAdapter {
  createMountRenderer() {
    let RSTNode = null;
    return {
      render(el, context, callback) {
        if (RSTNode === null) {
          const vnode = getVnode(el.type);
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
            instance: null,
            rendered: vNodeToRSTTree(vnode),
          };

          if (typeof callback === 'function') {
            callback();
          }
        }
      },

      unmount() {
        RSTNode = null;
      },

      getNode() {
        return RSTNode ? RSTNode.rendered : null;
      },

      simulateEvent(node, event, ...args) {
        node.props[`on${upperCasefirst(event)}`](...args);
      },
    };
  }

  createRenderer(options) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.RENDER: return throwError('render is not yet implemented');
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }
}

module.exports = InfernoAdapter;
