import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';
import { after, before } from 'mocha';
import { stub } from 'sinon';

before('setting up enzyme and jsdom', () => {
  const callback = warning => {
    /**
     * Ignore react-unsafe-component-lifecycles warnings since some old packages use those methods,
     * however they are still supported in react ^16 but will be deprecated in react >= 17
     *
     * Ignore component appears to be a function component that returns a class instance warning that is caused by react-relay
     */
    if (
      warning.includes('react-unsafe-component-lifecycles') ||
      warning.includes('component appears to be a function component')
    ) {
      return;
    }
    throw new Error(warning);
  };
  stub(console, 'error').callsFake(callback);
  stub(console, 'warn').callsFake(callback);

  const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
  const { window } = jsdom;

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

  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);

  configure({ adapter: new Adapter() });
});

after('reset the error handler function', () => {
  console.error.restore();
  console.warn.restore();
});

// prevent mocha from interpreting imported .png images
const noop = () => null;
require.extensions['.png'] = noop;
