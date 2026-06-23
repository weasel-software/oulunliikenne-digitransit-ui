'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRouter = require('react-router');

var _useIsoRelay = require('./useIsoRelay');

var _useIsoRelay2 = _interopRequireDefault(_useIsoRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactRouter.applyRouterMiddleware)(_useIsoRelay2.default);