'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = toTree;

var _infernoVnodeFlags = require('inferno-vnode-flags');

function getNodeType(el) {
  if (el.flags & _infernoVnodeFlags.ComponentFunction) {
    return 'function';
  }

  if (el._vNode || el.flags & _infernoVnodeFlags.ClassComponent || el.flags === 4) {
    return 'class';
  }

  return 'host';
}
function childrenToTree(node) {
  if (!node.children) {
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

function toTree(el) {
  if (el === null || (typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object') {
    return [el];
  }

  if (!el.type && el.children !== 0 && !el.children) {
    return null;
  }

  if (!el.type) {
    return el.children.toString();
  }

  var props = _extends({}, el.props);

  if (el.className) {
    props.className = el.className;
  }

  var nodeType = getNodeType(el);

  if (nodeType === 'class') {
    if (!el._vNode) {
      return {
        nodeType: nodeType,
        type: el.type,
        props: props,
        key: el.key,
        ref: el.ref,
        instance: el.children,
        rendered: !el.children ? null : toTree(el.children._lastInput)
      };
    }
    return {
      nodeType: nodeType,
      type: el._vNode.type,
      props: props,
      key: el._vNode.key,
      ref: el._vNode.ref,
      instance: el,
      rendered: toTree(el._lastInput)
    };
  }
  return {
    nodeType: nodeType,
    type: el.type,
    props: props,
    key: el.key,
    ref: el.ref,
    instance: nodeType === 'function' ? null : el.dom,
    rendered: childrenToTree(el)
  };
}