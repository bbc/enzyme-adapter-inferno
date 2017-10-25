function getType(vnode) {
  if (vnode._vNode) {
    return vnode._vNode.dom.tagName.toLowerCase();
  }
  return vnode.type;
}

export default function vNodeToRSTTree(vnode) {
  const props = {
    ...vnode.props,
    className: vnode.className,
  };


  if (vnode.children && Array.isArray(vnode.children)) {
    const rendered = vnode.children.map(vNodeToRSTTree);
    return {
      nodeType: 'host',
      type: getType(vnode),
      props,
      key: vnode.key,
      ref: vnode.ref,
      instance: null,
      rendered,
    };
  }

  if (vnode.children) {
    console.log('sada', vNodeToRSTTree(vnode.children));
    return {
      nodeType: 'host',
      type: getType(vnode),
      props,
      key: vnode.key,
      ref: vnode.ref,
      instance: null,
      rendered: vNodeToRSTTree(vnode.children),
    };
  }

  return {
    nodeType: 'host',
    type: getType(vnode),
    props,
    key: vnode.key,
    ref: vnode.ref,
    instance: null,
    rendered: null,
  };
}
