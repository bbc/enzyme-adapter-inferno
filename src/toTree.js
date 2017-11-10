import {
  ComponentFunction,
} from 'inferno-vnode-flags';

function getNodeType(el) {
  if (el.flags & ComponentFunction) {
    return 'function';
  }

  if (el._vNode) {
    return 'class';
  }

  return 'host';
}
function childrenToTree(node) {
  if (!node) {
    return null;
  }

  if (typeof node === 'string') {
    return [node];
  }

  if (Array.isArray(node.children)) {
    return node.children.map(toTree);
  }

  return toTree(node.children);
}

export default function toTree(el) {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return [el];
  }

  const props = {
    ...el.props,
  };

  if (el.className) {
    props.className = el.className;
  }

  const nodeType = getNodeType(el);

  if (nodeType === 'class') {
    return {
      nodeType,
      type: el._vNode.type,
      props,
      key: el._vNode.key,
      ref: el._vNode.key,
      instance: el,
      rendered: childrenToTree(el._lastInput),
    };
  }
  return {
    nodeType,
    type: el.type,
    props,
    key: el.key,
    ref: el.key,
    instance: nodeType === 'function' ? null : el.dom,
    rendered: childrenToTree(el),
  };
}
