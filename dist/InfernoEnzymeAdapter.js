'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _enzyme = require('enzyme');

var _inferno = require('inferno');

var _inferno2 = _interopRequireDefault(_inferno);

var _infernoVnodeFlags = require('inferno-vnode-flags');

var _infernoVnodeFlags2 = _interopRequireDefault(_infernoVnodeFlags);

var _infernoServer = require('inferno-server');

var _infernoServer2 = _interopRequireDefault(_infernoServer);

var _infernoCreateElement = require('inferno-create-element');

var _infernoCreateElement2 = _interopRequireDefault(_infernoCreateElement);

var _util = require('./util');

var _toTree = require('./toTree');

var _toTree2 = _interopRequireDefault(_toTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function upperCasefirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function isClassComponent(el) {
  return el.flags & _infernoVnodeFlags2.default.ClassComponent;
}

var InfernoAdapter = function (_EnzymeAdapter) {
  _inherits(InfernoAdapter, _EnzymeAdapter);

  function InfernoAdapter() {
    _classCallCheck(this, InfernoAdapter);

    return _possibleConstructorReturn(this, (InfernoAdapter.__proto__ || Object.getPrototypeOf(InfernoAdapter)).apply(this, arguments));
  }

  _createClass(InfernoAdapter, [{
    key: 'nodeToHostNode',
    value: function nodeToHostNode(node) {
      if (node.nodeType === 'class' || node.nodeType === 'function') {
        if (!node.rendered) {
          return node.rendered;
        }
        return Array.isArray(node.rendered) ? node.rendered[0] : node.rendered.instance;
      }
      return node.instance;
    }
  }, {
    key: 'nodeToElement',
    value: function nodeToElement(node) {
      if (!node || (typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') return null;
      // console.log(node.props)
      return (0, _infernoCreateElement2.default)(node.type, node.props);
    }
  }, {
    key: 'elementToNode',
    value: function elementToNode(el) {
      return (0, _toTree2.default)(el);
    }
  }, {
    key: 'createElement',
    value: function createElement() {
      return _infernoCreateElement2.default.apply(undefined, arguments);
    }
  }, {
    key: 'createMountRenderer',
    value: function createMountRenderer() {
      var domNode = global.document.createElement('span');
      var instance = null;
      return {
        render: function render(el, context, callback) {
          if (isClassComponent(el)) {
            instance = _inferno2.default.render(el, domNode);
          } else {
            _inferno2.default.render(el, domNode);
            instance = el;
          }
          if (typeof callback === 'function') {
            callback();
          }
        },
        unmount: function unmount() {
          instance.children.componentWillUnmount.apply(instance.children);
          instance = null;
        },
        getNode: function getNode() {
          return instance ? (0, _toTree2.default)(instance) : null;
        },
        simulateEvent: function simulateEvent(node, event) {
          var hostNode = node;
          var eventName = (0, _util.mapNativeEventNames)(event);
          if (node.type !== 'host') {
            hostNode = Array.isArray(node.rendered) ? node.rendered[0] : node.rendered;
          }
          var handler = hostNode.props['on' + upperCasefirst(eventName)];
          if (handler) {
            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              args[_key - 2] = arguments[_key];
            }

            handler.apply(undefined, _toConsumableArray(args));
          }
        }
      };
    }
  }, {
    key: 'createStringRenderer',
    value: function createStringRenderer() {
      return {
        render: function render(el) {
          return _infernoServer2.default.renderToString(el);
        }
      };
    }
  }, {
    key: 'createRenderer',
    value: function createRenderer(options) {
      switch (options.mode) {
        case _enzyme.EnzymeAdapter.MODES.MOUNT:
          return this.createMountRenderer(options);
        case _enzyme.EnzymeAdapter.MODES.SHALLOW:
          return (0, _util.throwError)('shallow is not yet implemented');
        case _enzyme.EnzymeAdapter.MODES.STRING:
          return this.createStringRenderer(options);
        default:
          throw new Error('Enzyme Internal Error: Unrecognized mode: ' + options.mode);
      }
    }
  }]);

  return InfernoAdapter;
}(_enzyme.EnzymeAdapter);

module.exports = InfernoAdapter;