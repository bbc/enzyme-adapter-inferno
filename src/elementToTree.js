/* eslint-disable */

import {
  ComponentClass,
  ComponentFunction,
} from 'inferno-vnode-flags';

function getType(el) {
  if (el._vNode) {
    return el._vNode.dom.tagName.toLowerCase();
  }
  return el.type;
}

function getNodeType(flags) {
  if (flags & ComponentFunction) {
    return 'function';
  }

  if (flags & ComponentClass) {
    return 'class';
  }

  return 'host';
}

function isIterable(obj) {
  return (
    obj != null &&
    typeof Symbol === 'function' &&
    typeof Symbol.iterator === 'symbol' &&
    typeof obj[Symbol.iterator] === 'function'
  );
}

function isArrayLike(obj) {
  return Array.isArray(obj) || (isIterable(obj) && typeof obj !== 'string');
}

function flatten(arrs) {
  return arrs.reduce(
    (flattened, item) => flattened.concat(isArrayLike(item) ? flatten([...item]) : item),
    [],
  );
}

function getInstance(el) {
  if (el.flags & ComponentFunction) {
    return null;
  }
  //
  // if (el.flags & ComponentClass) {
  //   return el.children;
  // }

  return el.dom;
}

export default function elementToTree(el) {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return [el];
  }
  const props = {
    ...el.props,
  };
  if (el.className) {
    props.className = el.className;
  }
  let rendered = null;
  if (isArrayLike(el.children)) {
    rendered = flatten([...el.children], true).map(elementToTree);
  } else if (typeof el.children !== 'undefined') {
    rendered = elementToTree(el.children);
  }
  return {
    nodeType: getNodeType(el.flags),
    type: el.type,
    props,
    key: el.key,
    ref: el.ref,
    instance: el.dom,
    rendered,
  };
}
