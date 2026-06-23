'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = prepareData;

var _isomorphicRelay = require('isomorphic-relay');

var _isomorphicRelay2 = _interopRequireDefault(_isomorphicRelay);

var _IsomorphicQueryAggregator = require('./IsomorphicQueryAggregator');

var _IsomorphicQueryAggregator2 = _interopRequireDefault(_IsomorphicQueryAggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prepareData(renderProps, networkLayer, preloadedRequests) {
  var queryAggregator = new _IsomorphicQueryAggregator2.default(renderProps);

  return _isomorphicRelay2.default.prepareData({
    Container: queryAggregator.Container,
    queryConfig: queryAggregator.queryConfig
  }, networkLayer, preloadedRequests).then(function (_ref) {
    var data = _ref.data,
        _ref$props = _ref.props,
        environment = _ref$props.environment,
        initialReadyState = _ref$props.initialReadyState;
    return {
      data: data,
      props: (0, _extends3.default)({}, renderProps, {
        environment: environment,
        initialReadyState: initialReadyState,
        queryAggregator: queryAggregator
      })
    };
  });
}