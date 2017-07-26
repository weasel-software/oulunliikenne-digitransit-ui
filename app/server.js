// React
import React from 'react';
import ReactDOM from 'react-dom/server';
import PropTypes from 'prop-types';

// Routing and state handling
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { getFarceResult } from 'found/lib/server';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import { Resolver } from 'found-relay';
import Helmet from 'react-helmet';
import provideContext from 'fluxible-addons-react/provideContext';

// Libraries
import serialize from 'serialize-javascript';
import { IntlProvider } from 'react-intl';
import polyfillService from 'polyfill-service';
import fs from 'fs';
import find from 'lodash/find';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Application
import appCreator from './app';
import translations from './translations';
import ApplicationHtml from './html';
import MUITheme from './MuiTheme';

// configuration
import { getConfiguration } from './config';

import Fetcher from './fetcher';
import { historyMiddlewares, render } from './routes';

// Look up paths for various asset files
const appRoot = `${process.cwd()}/`;

// cached assets
const cssDefs = {};
const sprites = {};

function getStringOrArrayElement(arrayOrString, index) {
  if (Array.isArray(arrayOrString)) {
    return arrayOrString[index];
  } else if (typeof arrayOrString === 'string') {
    return arrayOrString;
  }
  throw new Error(`Not array or string: ${arrayOrString}`);
}

let stats;
let manifest;

if (process.env.NODE_ENV !== 'development') {
  stats = require('../stats.json'); // eslint-disable-line global-require, import/no-unresolved

  const manifestFile = getStringOrArrayElement(
    stats.assetsByChunkName.manifest,
    0,
  );
  manifest = fs.readFileSync(`${appRoot}_static/${manifestFile}`);
}

function getCss(config) {
  if (!cssDefs[config.CONFIG]) {
    cssDefs[config.CONFIG] = [
      <link
        key="main_css"
        rel="stylesheet"
        type="text/css"
        href={`${config.APP_PATH}/${getStringOrArrayElement(
          stats.assetsByChunkName.main,
          1,
        )}`}
      />,
      <link
        key="theme_css"
        rel="stylesheet"
        type="text/css"
        href={`${config.APP_PATH}/${getStringOrArrayElement(
          stats.assetsByChunkName[`${config.CONFIG}_theme`],
          1,
        )}`}
      />,
    ];
  }
  return cssDefs[config.CONFIG];
}

function getSprite(config) {
  if (!sprites[config.CONFIG]) {
    let svgSprite;
    const spriteName = config.sprites;

    if (process.env.NODE_ENV !== 'development') {
      svgSprite = (
        <script
          dangerouslySetInnerHTML={{
            __html: `
            fetch('${config.APP_PATH}/${find(stats.modules, {
              name: `./static/${spriteName}`,
            })
              .assets[0]}').then(function(response) {return response.text();}).then(function(blob) {
              var div = document.createElement('div');
              div.innerHTML = blob;
              document.body.insertBefore(div, document.body.childNodes[0]);
            })
        `,
          }}
        />
      );
    } else {
      svgSprite = (
        <div
          dangerouslySetInnerHTML={{
            __html: fs
              .readFileSync(`${appRoot}_static/${spriteName}`)
              .toString(),
          }}
        />
      );
    }
    sprites[config.CONFIG] = svgSprite;
  }
  return sprites[config.CONFIG];
}

function getPolyfills(userAgent, config) {
  // Do not trust Samsung, LG
  // see https://digitransit.atlassian.net/browse/DT-360
  // https://digitransit.atlassian.net/browse/DT-445
  // Also https://github.com/Financial-Times/polyfill-service/issues/727
  if (
    !userAgent ||
    /(IEMobile|LG-|GT-|SM-|SamsungBrowser|Google Page Speed Insights)/.test(
      userAgent,
    )
  ) {
    userAgent = ''; // eslint-disable-line no-param-reassign
  }

  const features = {
    'caniuse:console-basic': { flags: ['gated'] },
    default: { flags: ['gated'] },
    es5: { flags: ['gated'] },
    es6: { flags: ['gated'] },
    es7: { flags: ['gated'] },
    es2017: { flags: ['gated'] },
    fetch: { flags: ['gated'] },
    Intl: { flags: ['gated'] },
    'Object.assign': { flags: ['gated'] },
    matchMedia: { flags: ['gated'] },
  };

  config.availableLanguages.forEach(language => {
    features[`Intl.~locale.${language}`] = {
      flags: ['gated'],
    };
  });

  return polyfillService
    .getPolyfillString({
      uaString: userAgent,
      features,
      minify: process.env.NODE_ENV !== 'development',
      unknown: 'polyfill',
    })
    .then(polyfills =>
      // no sourcemaps for inlined js
      polyfills.replace(/^\/\/# sourceMappingURL=.*$/gm, ''),
    );
}

function getScripts(req, config) {
  if (process.env.NODE_ENV === 'development') {
    return <script async src={'/proxy/js/bundle.js'} />;
  }
  return [
    <script key="manifest " dangerouslySetInnerHTML={{ __html: manifest }} />,
    <script
      key="common_js"
      src={`${config.APP_PATH}/${getStringOrArrayElement(
        stats.assetsByChunkName.common,
        0,
      )}`}
    />,
    <script
      key="leaflet_js"
      src={`${config.APP_PATH}/${getStringOrArrayElement(
        stats.assetsByChunkName.leaflet,
        0,
      )}`}
    />,
    <script
      key="min_js"
      src={`${config.APP_PATH}/${getStringOrArrayElement(
        stats.assetsByChunkName.main,
        0,
      )}`}
    />,
  ];
}

const ContextProvider = provideContext(IntlProvider, {
  config: PropTypes.object,
  url: PropTypes.string,
  headers: PropTypes.object,
  relayEnvironment: PropTypes.object,
});

export default async function(req, res, next) {
  try {
    const config = getConfiguration(req);
    const application = appCreator(config);

    // TODO: Move this to PreferencesStore
    // 1. use locale from cookie (user selected) 2. browser preferred 3. default
    let locale =
      req.cookies.lang || req.acceptsLanguages(config.availableLanguages);

    if (config.availableLanguages.indexOf(locale) === -1) {
      locale = config.defaultLanguage;
    }

    if (req.cookies.lang === undefined || req.cookies.lang !== locale) {
      res.cookie('lang', locale);
    }

    const fetcher = new Fetcher(`${config.URL.OTP}index/graphql`);

    const environment = new Environment({
      network: Network.create((...args) => fetcher.fetch(...args)),
      store: new Store(new RecordSource()),
    });

    const resolver = new Resolver(environment);

    const { redirect, status, element } = await getFarceResult({
      url: req.url,
      historyMiddlewares,
      routeConfig: makeRouteConfig(application.getComponent()),
      resolver,
      render,
    });

    if (redirect) {
      res.redirect(302, redirect.url);
      return;
    }

    const context = application.createContext({
      url: req.url,
      headers: req.headers,
      config,
    });

    context
      .getComponentContext()
      .getStore('MessageStore')
      .addConfigMessages(config);

    // required by material-ui
    const agent = req.headers['user-agent'];
    global.navigator = { userAgent: agent };

    const polyfills = await getPolyfills(agent, config);

    const content = ReactDOM.renderToString(
      <ContextProvider
        locale={locale}
        messages={translations[locale]}
        context={{
          ...context.getComponentContext(),
          relayEnvironment: environment,
        }}
      >
        <MuiThemeProvider
          muiTheme={getMuiTheme(
            MUITheme(context.getComponentContext().config),
            {
              userAgent: agent,
            },
          )}
        >
          {element}
        </MuiThemeProvider>
      </ContextProvider>,
    );

    const head = Helmet.rewind();

    res.status(status).send(`<!doctype html>
        ${ReactDOM.renderToStaticMarkup(
          <ApplicationHtml
            css={
              process.env.NODE_ENV === 'development' ? false : getCss(config)
            }
            svgSprite={getSprite(config)}
            content={content}
            polyfill={polyfills}
            state={`window.state=${serialize(application.dehydrate(context))};`}
            locale={locale}
            scripts={getScripts(req, config)}
            fonts={config.URL.FONT}
            relayData={fetcher.toJSON()}
            head={head}
          />,
        )}`);
  } catch (err) {
    next(err);
  }
}
