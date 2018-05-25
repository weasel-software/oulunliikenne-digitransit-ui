import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import { before } from 'mocha';

require.extensions['.css'] = () => null;

const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }),
      {},
    );
  Object.defineProperties(target, props);
};

const setupJsDom = () => {
  const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
  const { window } = jsdom;

  global.window = window;
  global.document = window.document;
  global.navigator = {
    platform: 'node.js',
    userAgent: 'node.js',
  };
  global.L = require('leaflet');
  copyProps(window, global);
};

before('setting up enzyme', () => {
  setupJsDom();
  configure({ adapter: new Adapter() });
});
