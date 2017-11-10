import {
  EnzymeAdapter,
} from 'enzyme';
import Inferno from 'inferno';
import VNodeFlags from 'inferno-vnode-flags';
import {
  throwError,
} from './util';
import toTree from './toTree';

function upperCasefirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isClassComponent(el) {
  return el.flags & VNodeFlags.ClassComponent;
}

class InfernoAdapter extends EnzymeAdapter {
  nodeToHostNode(node) {
    return Array.isArray(node.rendered) ? node.rendered[0] : node.rendered;
  }

  elementToNode(el) {
    return toTree(el);
  }

  createMountRenderer() {
    const domNode = global.document.createElement('div');
    let instance = null;
    return {
      render(el) {
        if (isClassComponent(el)) {
          instance = Inferno.render(el, domNode);
        } else {
          Inferno.render(el, domNode);
          instance = el;
        }
      },

      unmount() {
        instance.componentWillUnmount.apply(instance);
        instance = null;
      },

      getNode() {
        if (instance && instance._vNode) {
          return instance ? toTree(instance) : null;
        }
        return instance ? toTree(instance) : null;
      },

      simulateEvent(node, event, ...args) {
        node.props[`on${upperCasefirst(event)}`](...args);
      },
    };
  }

  createRenderer(options) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW: return throwError('shallow is not yet implemented');
      case EnzymeAdapter.MODES.RENDER: return throwError('render is not yet implemented');
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }
}

module.exports = InfernoAdapter;
