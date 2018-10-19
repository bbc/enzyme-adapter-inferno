import { VNodeFlags } from 'inferno-vnode-flags';

const flatten = a => a.reduce(
  (acc, e) => (Array.isArray(e) ? [...acc, ...flatten(e)] : [...acc, e]), [],
);

const getNodeTypeForFlags = (flags) => {
  const checkFlag = flag => flags & flag;

  if (checkFlag(VNodeFlags.Text)) {
    return 'text';
  }
  if (checkFlag(VNodeFlags.Fragment)) {
    return 'fragment';
  }
  if (checkFlag(VNodeFlags.ComponentFunction)) {
    return 'function';
  }
  if (checkFlag(VNodeFlags.ComponentClass)) {
    return 'class';
  }

  return 'host';
};

const getNodeType = (node) => {
  // <span>foo</span> == { ..., children: 'foo' }
  // (class ... render() { null }) == { ..., children: '' } ?
  if (typeof node === 'string' && node !== '') { return 'string'; }
  if (typeof node === 'number') { return 'number'; }
  // <div><span>a</span><span>b</span></div>
  // == { ..., children: [ { ..., children: 'a' }, { ..., children: 'b' } ] }
  if (Array.isArray(node)) { return 'collection'; }

  // render null
  if (!node || !node.flags) { return 'unknown'; }
  return getNodeTypeForFlags(node.flags);
};

const createProps = (el) => {
  const { children, ...props } = { ...el.props }; // Remove children from properties

  if (el.className) {
    return { // Move className into properties
      ...props,
      className: el.className,
    };
  }

  return props;
};

const renderHostNode = (hostNode) => {
  if (!hostNode.children) { return [hostNode.children]; }
  return toTree(hostNode.children);
};

const instantiateClassNode = (classNode) => {
  if (!classNode) { return classNode; }
  // eslint-disable-next-line no-param-reassign
  classNode.refs = {};
  return classNode;
};

export default function toTree(node) {
  const nodeType = getNodeType(node);
  switch (nodeType) {
    case 'fragment': throw new Error('wip - type fragment not implemented');
    case 'class': return {
      nodeType,
      type: node.type,
      props: createProps(node),
      key: node.key,
      ref: node.ref,
      instance: instantiateClassNode(node.children),
      rendered: node.children ? toTree(node.children.$LI) : null, // $LI == Last Input
    };
    case 'function': return {
      nodeType,
      type: node.type,
      props: createProps(node),
      key: node.key,
      ref: node.ref,
      instance: null,
      rendered: toTree(node.children),
    };
    case 'host': return {
      nodeType,
      type: node.type,
      props: createProps(node),
      key: node.key,
      ref: node.ref,
      instance: node.dom,
      rendered: renderHostNode(node),
    };
    case 'text': return toTree(node.children);
    case 'string': return [node];
    case 'number': return [`${node}`];
    case 'collection': return flatten(node.map(toTree));
    case 'unknown': return null;
    default: throw new Error(`EnzymeAdapter internal error - type ${nodeType} not supported`);
  }
}
