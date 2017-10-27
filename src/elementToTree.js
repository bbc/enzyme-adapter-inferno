function getType(el) {
  if (el._vNode) {
    return el._vNode.dom.tagName.toLowerCase();
  }
  return el.type;
}

export default function elementToTree(el) {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return el;
  }

  const props = {
    ...el.props,
    className: el.className,
  };

  if (el.children && Array.isArray(el.children)) {
    const rendered = el.children.map(elementToTree);
    return {
      nodeType: 'host',
      type: getType(el),
      props,
      key: el.key,
      ref: el.ref,
      instance: el,
      rendered,
    };
  }

  if (el.children) {
    return {
      nodeType: 'host',
      type: getType(el),
      props,
      key: el.key,
      ref: el.ref,
      instance: el,
      rendered: elementToTree(el.children),
    };
  }

  return {
    nodeType: 'host',
    type: getType(el),
    props,
    key: el.key,
    ref: el.ref,
    instance: el,
    rendered: null,
  };
}
