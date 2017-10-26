import { EnzymeAdapter } from 'enzyme';
import Inferno from 'inferno';
import { throwError } from './util';
import vNodeToRSTTree from './vNodeToRSTTree';

function upperCasefirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class InfernoAdapter extends EnzymeAdapter {
  nodeToHostNode(node) {
    return node.instance.dom;
  }

  createMountRenderer() {
    const domNode = global.document.createElement('div');
    let instance = null;
    return {
      render(el) {
        instance = Inferno.render(el, domNode);
      },

      unmount() {
        instance = null;
      },

      getNode() {
        if (instance._vNode) {
          return instance ? vNodeToRSTTree(instance._vNode) : null;
        }
        return instance ? vNodeToRSTTree(instance) : null;
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
