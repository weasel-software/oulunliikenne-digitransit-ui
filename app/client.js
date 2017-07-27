import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import BrowserProtocol from 'farce/lib/BrowserProtocol';
import createFarceRouter from 'found/lib/createFarceRouter';
import createFarceStore from 'found/lib/utils/createFarceStore';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import getStoreRenderArgs from 'found/lib/getStoreRenderArgs';
import { Resolver } from 'found-relay';
import provideContext from 'fluxible-addons-react/provideContext';
import tapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import debug from 'debug';
import OfflinePlugin from 'offline-plugin/runtime';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

import Fetcher from './fetcher';
import { historyMiddlewares, render } from './routes';

import Raven from './util/Raven';
import configureMoment from './util/configure-moment';
import StoreListeningIntlProvider from './util/StoreListeningIntlProvider';
import MUITheme from './MuiTheme';
import appCreator from './app';
import translations from './translations';
import { initGeolocation } from './action/PositionActions';
import { COMMIT_ID, BUILD_TIME } from './buildInfo';
import Piwik from './util/piwik';

const plugContext = f => () => ({
  plugComponentContext: f,
  plugActionContext: f,
  plugStoreContext: f,
});

window.debug = debug; // Allow _debug.enable('*') in browser console

// Material-ui uses touch tap events
tapEventPlugin();

// TODO: this is an ugly hack, but required due to cyclical processing in app
const config = window.state.context.plugins['extra-context-plugin'].config;
const app = appCreator(config);

const piwik = Piwik.getTracker(config.PIWIK_ADDRESS, config.PIWIK_ID);

if (!config.PIWIK_ADDRESS || !config.PIWIK_ID || config.PIWIK_ID === '') {
  piwik.trackEvent = () => {};
  piwik.setCustomVariable = () => {};
  piwik.trackPageView = () => {};
}

const addPiwik = c => (c.piwik = piwik); // eslint-disable-line no-param-reassign

const piwikPlugin = {
  name: 'PiwikPlugin',
  plugContext: plugContext(addPiwik),
};

const raven = Raven(config.SENTRY_DSN, piwik.getVisitorId());

// eslint-disable-next-line no-param-reassign
const addRaven = c => (c.raven = raven);

const ravenPlugin = {
  name: 'RavenPlugin',
  plugContext: plugContext(addRaven),
};

// Add plugins
app.plug(ravenPlugin);
app.plug(piwikPlugin);

// Run application
(async function init() {
  // Guard againist Samsung et.al. which are not properly polyfilled by polyfill-service
  if (typeof window.Intl === 'undefined') {
    const modules = [
      import(/* webpackChunkName: "intl",  webpackMode: "lazy" */ 'intl'),
    ];

    config.availableLanguages.forEach(language => {
      modules.push(
        import(/* webpackChunkName: "intl",  webpackMode: "lazy-once" */ `intl/locale-data/jsonp/${language}`),
      );
    });

    await Promise.all(modules);
  }

  const context = await app.rehydrate(window.state);

  window.context = context;

  if (process.env.NODE_ENV === 'development') {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(`../sass/themes/${config.CONFIG}/main.scss`);
    } catch (error) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require('../sass/themes/default/main.scss');
    }
  }

  const fetcher = new Fetcher(
    `${config.URL.OTP}index/graphql`,
    // eslint-disable-next-line no-underscore-dangle
    JSON.parse(document.getElementById('relayData').textContent),
  );

  const environment = new Environment({
    network: Network.create((...args) => fetcher.fetch(...args)),
    store: new Store(new RecordSource()),
  });

  const resolver = new Resolver(environment);

  const routeConfig = makeRouteConfig(app.getComponent());

  const historyProtocol = new BrowserProtocol();

  const store = createFarceStore({
    historyProtocol,
    historyMiddlewares,
    routeConfig,
  });

  await getStoreRenderArgs({
    store,
    resolver,
  });

  const Router = await createFarceRouter({
    historyProtocol,
    historyMiddlewares,
    routeConfig,
    resolver,
    render,
  });

  context
    .getComponentContext()
    .getStore('MessageStore')
    .addConfigMessages(config);

  const language = context
    .getComponentContext()
    .getStore('PreferencesStore')
    .getLanguage();

  configureMoment(language, config);

  const ContextProvider = provideContext(StoreListeningIntlProvider, {
    piwik: PropTypes.object,
    raven: PropTypes.object,
    url: PropTypes.string,
    config: PropTypes.object,
    headers: PropTypes.object,
    relayEnvironment: PropTypes.object,
  });

  // init geolocation handling
  await context.executeAction(initGeolocation);

  ReactDOM.render(
    <ContextProvider
      translations={translations}
      context={{
        ...context.getComponentContext(),
        relayEnvironment: environment,
      }}
    >
      <MuiThemeProvider
        muiTheme={getMuiTheme(MUITheme(config), {
          userAgent: navigator.userAgent,
        })}
      >
        <Router resolver={resolver} />
      </MuiThemeProvider>
    </ContextProvider>,
    document.getElementById('app'),
    () => {
      // Run only in production mode and when built in a docker container
      if (process.env.NODE_ENV === 'production' && BUILD_TIME !== 'unset') {
        OfflinePlugin.install();
      }
    },
  );
  // Listen for Web App Install Banner events
  window.addEventListener('beforeinstallprompt', e => {
    piwik.trackEvent('installprompt', 'fired');

    // e.userChoice will return a Promise. (Only in chrome, not IE)
    if (e.userChoice) {
      e.userChoice.then(choiceResult =>
        piwik.trackEvent('installprompt', 'result', choiceResult.outcome),
      );
    }
  });

  piwik.enableLinkTracking();

  // Send perf data after React has compared real and shadow DOMs
  // and started positioning
  piwik.setCustomVariable(4, 'commit_id', COMMIT_ID, 'visit');
  piwik.setCustomVariable(5, 'build_time', BUILD_TIME, 'visit');
})();
