'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('react-router-relay/lib');

var _lib2 = _interopRequireDefault(_lib);

var _IsomorphicRelayRouterContext = require('./IsomorphicRelayRouterContext');

var _IsomorphicRelayRouterContext2 = _interopRequireDefault(_IsomorphicRelayRouterContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  renderRouterContext: function renderRouterContext(child, props) {
    return _react2.default.createElement(
      _IsomorphicRelayRouterContext2.default,
      props,
      child
    );
  },

  renderRouteComponent: _lib2.default.renderRouteComponent
};