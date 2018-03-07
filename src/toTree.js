import { VNodeFlags } from 'inferno-vnode-flags';

function getNodeType(el) {
  if (el.flags & VNodeFlags.ComponentFunction) {
    return 'function';
  }

  if (el.$V || el.flags & VNodeFlags.ComponentClass || el.flags === 4) {
    return 'class';
  }

  return 'host';
}
function childrenToTree(node) {
  if (!node.children) {
    return undefined;
  }

  if (typeof node === 'string') {
    return [node];
  }

  if (Array.isArray(node.children)) {
    return node.children.map(toTree);
  }

  if (node.children.flags & VNodeFlags.Text) {
    const tree = toTree(node.children);
    return tree ? [tree] : tree;
  }

  return toTree(node.children);
}

export default function toTree(el) {
  if (el === null || typeof el !== 'object') {
    return [el];
  }

  if (!el.type && el.children !== 0 && !el.children) {
    return null;
  }

  if (!el.type) {
    return el.children.toString();
  }

  const props = {
    ...el.props,
  };

  if (el.className) {
    props.className = el.className;
  }

  const nodeType = getNodeType(el);

  if (nodeType === 'class') {
    if (!el.$V) {
      if (el.children) {
        el.children.refs = {}; // eslint-disable-line no-param-reassign
      }
      return {
        nodeType,
        type: el.type,
        props,
        key: el.key,
        ref: el.ref,
        instance: el.children,
        rendered: !el.children ? null : toTree(el.children.$LI),
      };
    }
    el.refs = {}; // eslint-disable-line no-param-reassign
    return {
      nodeType,
      type: el.$V.type,
      props,
      key: el.$V.key,
      ref: el.$V.ref,
      instance: el,
      rendered: toTree(el.$LI),
    };
  }
  return {
    nodeType,
    type: el.type,
    props,
    key: el.key,
    ref: el.ref,
    instance: nodeType === 'function' ? null : el.dom,
    rendered: childrenToTree(el),
  };
}
