import { EnzymeAdapter } from 'enzyme';
import { VNodeFlags } from 'inferno-vnode-flags';
import { renderToString } from 'inferno-server';
import { options as InfernoOptions, render } from 'inferno';
import { createElement } from 'inferno-create-element';
import {
  mapNativeEventNames,
  throwError,
} from './util';
import toTree from './toTree';

InfernoOptions.recyclingEnabled = false;

function upperCasefirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isClassComponent(el) {
  return el.flags & VNodeFlags.ComponentClass;
}

class InfernoAdapter extends EnzymeAdapter {
  nodeToHostNode(node) {
    if (node.nodeType === 'class' || node.nodeType === 'function') {
      if (!node.rendered) {
        return node.rendered;
      }
      return Array.isArray(node.rendered) ? node.rendered[0] : node.rendered.instance;
    }
    return node.instance;
  }

  nodeToElement(node) {
    if (!node || typeof node !== 'object') return null;

    const el = createElement(node.type, node.props);
    if (el.className) {
      el.props.className = el.className;
    }
    return el;
  }

  elementToNode(el) {
    return toTree(el);
  }

  createElement(...args) {
    return createElement(...args);
  }

  createMountRenderer(options) {
    const domNode = options.attachTo || global.document.createElement('span');
    let instance = null;
    return {
      render(el, context, callback) {
        InfernoOptions.roots = [];
        if (isClassComponent(el)) {
          instance = render(el, domNode);
        } else {
          render(el, domNode);
          instance = el;
        }
        if (typeof callback === 'function') {
          callback();
        }
      },

      unmount() {
        instance = null;
        render(null, domNode);
      },

      getNode() {
        if (instance) {
          if (instance.$V) {
            return toTree(instance.$V);
          }
          return toTree(instance);
        }
        return null;
      },

      batchedUpdates(fn) {
        return fn;
      },

      simulateEvent(node, event, ...args) {
        let hostNode = node;
        const eventName = mapNativeEventNames(event);
        if (node.nodeType !== 'host') {
          hostNode = Array.isArray(node.rendered) ? node.rendered[0] : node.rendered;
        }
        const handler = hostNode.props[`on${upperCasefirst(eventName)}`];
        if (handler) {
          if (typeof handler === 'function') {
            handler(...args);
          } else {
            handler.event(handler.data, ...args);
          }
        }
      },
    };
  }
  createStringRenderer() {
    return {
      render(el) {
        return renderToString(el);
      },
    };
  }

  createRenderer(options) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW: return throwError('shallow is not yet implemented');
      case EnzymeAdapter.MODES.STRING: return this.createStringRenderer(options);
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }
}

module.exports = InfernoAdapter;
