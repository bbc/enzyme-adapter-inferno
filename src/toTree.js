import { VNodeFlags } from 'inferno-vnode-flags';

const nodeTypes = {
  Text: Symbol('text'),
  Fragment: Symbol('fragment'),
  Function: Symbol('function'),
  Class: Symbol('class'),
  Host: Symbol('host'),
  Null: Symbol('null'),
  String: Symbol('string'),
  Number: Symbol('number'),
  Collection: Symbol('collection'),
};
const nodeTypeToString = nodeType => nodeType.toString().slice(7, -1);

const flatten = a => a.reduce(
  (acc, e) => (Array.isArray(e) ? [...acc, ...flatten(e)] : [...acc, e]), [],
);

const getNodeTypeForFlags = (flags) => {
  const checkFlag = flag => flags & flag;

  if (checkFlag(VNodeFlags.Text)) {
    return nodeTypes.Text;
  }
  if (checkFlag(VNodeFlags.Fragment)) {
    return nodeTypes.Fragment;
  }
  if (checkFlag(VNodeFlags.ComponentFunction)) {
    return nodeTypes.Function;
  }
  if (checkFlag(VNodeFlags.ComponentClass)) {
    return nodeTypes.Class;
  }

  return nodeTypes.Host; // TODO: Don't return Host by default
};

const getNodeType = (node) => {
  // <span>foo</span> == { ..., children: 'foo' }
  // (class ... render() { null }) == { ..., children: '' } ?
  if (typeof node === 'string' && node !== '') { return nodeTypes.String; }
  if (typeof node === 'number') { return nodeTypes.Number; }

  // <div><span>a</span><span>b</span></div>
  // == { ..., children: [ { ..., children: 'a' }, { ..., children: 'b' } ] }
  if (Array.isArray(node)) { return nodeTypes.Collection; }

  // render null
  if (!node || !node.flags) { return nodeTypes.Null; }
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
    case nodeTypes.Fragment: throw new Error('wip - type fragment not implemented');
    case nodeTypes.Class: return {
      nodeType: nodeTypeToString(nodeType),
      type: node.type,
      props: createProps(node),
      key: node.key,
      ref: node.ref,
      instance: instantiateClassNode(node.children),
      rendered: node.children ? toTree(node.children.$LI) : null, // $LI == Last Input
    };
    case nodeTypes.Function: return {
      nodeType: nodeTypeToString(nodeType),
      type: node.type,
      props: createProps(node),
      key: node.key,
      ref: node.ref,
      instance: null,
      rendered: toTree(node.children),
    };
    case nodeTypes.Host: return {
      nodeType: nodeTypeToString(nodeType),
      type: node.type,
      props: createProps(node),
      key: node.key,
      ref: node.ref,
      instance: node.dom,
      rendered: renderHostNode(node),
    };
    case nodeTypes.Text: return toTree(node.children);
    case nodeTypes.String: return [node];
    case nodeTypes.Number: return [`${node}`];
    case nodeTypes.Collection: return flatten(node.map(toTree));
    case nodeTypes.Null: return null;
    default: throw new Error(`EnzymeAdapter internal error - type ${nodeType} not supported`);
  }
}
