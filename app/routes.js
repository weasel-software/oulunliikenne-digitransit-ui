/* eslint-disable react/jsx-key */

import PropTypes from 'prop-types';
// Libraries
import React from 'react';
import Route from 'found/lib/Route';
import Redirect from 'found/lib/Redirect';
import queryMiddleware from 'farce/lib/queryMiddleware';
import createRender from 'found/lib/createRender';
import { graphql } from 'relay-runtime';
import ContainerDimensions from 'react-container-dimensions';

import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';

import moment from 'moment';

// React pages
import IndexPage from './component/IndexPage';
import Error404 from './component/404';
import NetworkError from './component/NetworkError';
import Loading from './component/LoadingPage';
import SplashOrChildren from './component/SplashOrChildren';

import { otpToLocation } from './util/otpStrings';

import TopLevel from './component/TopLevel';
import Title from './component/Title';

import { isBrowser } from './util/browser';

// Localstorage data
import { getCustomizedSettings } from './store/localStorage';

export const historyMiddlewares = [queryMiddleware];

export const render = createRender({});

const ComponentLoading404Renderer = {
  /* eslint-disable react/prop-types */
  header: ({ error, props, element, retry }) => {
    if (error) {
      if (
        error.message === 'Failed to fetch' || // Chrome
        error.message === 'Network request failed' // Safari && FF && IE
      ) {
        return <NetworkError retry={retry} />;
      }
      return <Error404 />;
    } else if (props) {
      return React.cloneElement(element, props);
    }
    return <Loading />;
  },
  map: ({ error, props, element }) => {
    if (error) {
      return null;
    } else if (props) {
      return React.cloneElement(element, props);
    }
    return undefined;
  },
  title: ({ props, element }) =>
    React.cloneElement(element, { route: null, ...props }),
  content: ({ props, element }) =>
    props ? React.cloneElement(element, props) : <div className="flex-grow" />,
  /* eslint-enable react/prop-types */
};

function errorLoading(err) {
  console.error('Dynamic page loading failed', err);
}

function getDefault(module) {
  return module.default;
}

function getIntermediatePlaces(intermediatePlaces) {
  if (!intermediatePlaces) {
    return [];
  } else if (Array.isArray(intermediatePlaces)) {
    return intermediatePlaces.map(otpToLocation);
  } else if (typeof intermediatePlaces === 'string') {
    return [otpToLocation(intermediatePlaces)];
  }
  return [];
}

function getSettings() {
  const custSettings = getCustomizedSettings();

  return {
    walkSpeed: custSettings.walkSpeed
      ? Number(custSettings.walkSpeed)
      : undefined,
    walkReluctance: custSettings.walkReluctance
      ? Number(custSettings.walkReluctance)
      : undefined,
    walkBoardCost: custSettings.walkBoardCost
      ? Number(custSettings.walkBoardCost)
      : undefined,
    modes: custSettings.modes
      ? custSettings.modes
          .toString()
          .split(',')
          .map(mode => (mode === 'CITYBIKE' ? 'BICYCLE_RENT' : mode))
          .sort()
          .join(',')
      : undefined,
    minTransferTime: custSettings.minTransferTime
      ? Number(custSettings.minTransferTime)
      : undefined,
    accessibilityOption: custSettings.accessibilityOption
      ? custSettings.accessibilityOption
      : undefined,
  };
}

export default config => {
  const preparePlanParams = (
    { from, to },
    {
      location: {
        query: {
          intermediatePlaces,
          time,
          arriveBy,
          walkReluctance,
          walkSpeed,
          walkBoardCost,
          minTransferTime,
          modes,
          accessibilityOption,
        },
      },
    },
  ) => {
    const settings = getSettings();
    return omitBy(
      {
        fromPlace: from,
        toPlace: to,
        from: otpToLocation(from),
        to: otpToLocation(to),
        intermediatePlaces: getIntermediatePlaces(intermediatePlaces),
        numItineraries:
          typeof matchMedia !== 'undefined' &&
          matchMedia('(min-width: 900px)').matches
            ? 5
            : 3,
        modes: modes
          ? modes
              .split(',')
              .map(mode => (mode === 'CITYBIKE' ? 'BICYCLE_RENT' : mode))
              .sort()
              .join(',')
          : settings.modes,
        date: (time ? moment(time * 1000) : moment()).format('YYYY-MM-DD'),
        time: (time ? moment(time * 1000) : moment()).format('HH:mm:ss'),
        walkReluctance: walkReluctance
          ? Number(walkReluctance)
          : settings.walkReluctance,
        walkBoardCost: walkBoardCost
          ? Number(walkBoardCost)
          : settings.walkBoardCost,
        minTransferTime: minTransferTime
          ? Number(minTransferTime)
          : settings.minTransferTime,
        walkSpeed: walkSpeed ? Number(walkSpeed) : settings.walkSpeed,
        arriveBy: arriveBy === 'true',
        maxWalkDistance:
          typeof modes === 'undefined' ||
          (typeof modes === 'string' && !modes.split(',').includes('BICYCLE'))
            ? config.maxWalkDistance
            : config.maxBikingDistance,
        wheelchair:
          accessibilityOption === '1'
            ? true
            : settings.accessibilityOption === '1',
        preferred: { agencies: config.preferredAgency || '' },
        disableRemainingWeightHeuristic:
          modes && modes.split(',').includes('CITYBIKE'),
      },
      isNil,
    );
  };

  const TopLevelContainer = (props, { headers }) =>
    isBrowser
      ? <ContainerDimensions>
          <TopLevel {...props} />
        </ContainerDimensions>
      : <TopLevel
          {...props}
          width={headers['user-agent'].includes('Mobile') ? 400 : 1000}
        />;

  TopLevelContainer.contextTypes = {
    headers: PropTypes.object.isRequired,
  };

  return (
    <Route Component={TopLevelContainer}>
      <Route
        path="/"
        topBarOptions={{ disableBackButton: true }}
        groups={{
          title: (
            <Route Component={Title}>
              <Route path={'*'} />
            </Route>
          ),
          content: (
            <Route
              Component={props =>
                <SplashOrChildren>
                  <IndexPage {...props} />
                </SplashOrChildren>}
            >
              <Route
                path="lahellasi"
                getComponent={() =>
                  import(/* webpackChunkName: "nearby" */ './component/NearbyRoutesPanel')
                    .then(getDefault)
                    .catch(errorLoading)}
              />
              <Route
                path="suosikit"
                getComponent={() =>
                  import(/* webpackChunkName: "nearby" */ './component/FavouritesPanel')
                    .then(getDefault)
                    .catch(errorLoading)}
              />
            </Route>
          ),
        }}
      />
      <Route path="/pysakit">
        <Route Component={Error404} />
        {/* TODO: Should return list of all stops*/}
        <Route
          path=":stopId"
          groups={{
            title: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopTitle').then(
                    getDefault,
                  )}
              />
            ),
            header: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPageHeaderContainer').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_StopPageHeaderContainer_Query($stopId: String!) {
                    stop(id: $stopId) {
                      ...StopPageHeaderContainer_stop
                    }
                  }
                `}
              />
            ),
            content: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPage').then(
                    getDefault,
                  )}
              />
            ),
            map: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPageMap').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_StopPageMap_Query($stopId: String!) {
                    stop(id: $stopId) {
                      ...StopPageMap_stop
                    }
                  }
                `}
              />
            ),
            meta: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPageMeta').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_StopPageMeta_Query($stopId: String!) {
                    stop(id: $stopId) {
                      ...StopPageMeta_stop
                    }
                  }
                `}
              />
            ),
          }}
        />
      </Route>
      <Route path="/terminaalit">
        <Route Component={Error404} />
        {/* TODO: Should return list of all terminals*/}
        <Route
          path=":terminalId"
          groups={{
            title: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/TerminalTitle').then(
                    getDefault,
                  )}
              />
            ),
            header: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPageHeaderContainer').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_TerminalPageHeaderContainer_Query(
                    $terminalId: String!
                  ) {
                    stop: station(id: $terminalId) {
                      ...StopPageHeaderContainer_stop
                    }
                  }
                `}
              />
            ),
            content: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/TerminalPage').then(
                    getDefault,
                  )}
              />
            ),
            map: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPageMap').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_TerminalPageMap_Query($terminalId: String!) {
                    stop: station(id: $terminalId) {
                      ...StopPageMap_stop
                    }
                  }
                `}
              />
            ),
            meta: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "stop" */ './component/StopPageMeta').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_TerminalPageMeta_Query($terminalId: String!) {
                    stop: station(id: $terminalId) {
                      ...StopPageMeta_stop
                    }
                  }
                `}
              />
            ),
          }}
        />
      </Route>
      <Route path="/linjat">
        <Route Component={Error404} />
        {/* TODO: Should return list of all routes */}
        <Route
          path=":routeId"
          groups={{
            title: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "route" */ './component/RouteTitle').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_RouteTitle_Query($routeId: String!) {
                    route(id: $routeId) {
                      ...RouteTitle_route
                    }
                  }
                `}
              >
                <Route path="*" />
              </Route>
            ),
            meta: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "route" */ './component/RoutePageMeta').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_RoutePageMeta_Query($routeId: String!) {
                    route(id: $routeId) {
                      ...RoutePageMeta_route
                    }
                  }
                `}
              >
                <Route path="*" />
              </Route>
            ),
            header: (
              <Route
                getComponent={() =>
                  import(/* webpackChunkName: "route" */ './component/RoutePage').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_RoutePage_Query($routeId: String!) {
                    route(id: $routeId) {
                      ...RoutePage_route
                    }
                  }
                `}
              >
                <Route path="*" />
              </Route>
            ),
            map: (
              <Route>
                <Route
                  path="/:type"
                  Component={({ children }) => children || <div />}
                >
                  <Route
                    path=":patternId"
                    getComponent={() =>
                      import(/* webpackChunkName: "route" */ './component/RouteMapContainer').then(
                        getDefault,
                      )}
                    query={graphql`
                      query routes_RouteMapContainer_Query(
                        $patternId: String!
                      ) {
                        pattern(id: $patternId) {
                          ...RouteMapContainer_pattern
                        }
                      }
                    `}
                  />
                  <Route
                    path=":patternId/:tripId"
                    getComponent={() =>
                      import(/* webpackChunkName: "route" */ './component/RouteMapContainer').then(
                        getDefault,
                      )}
                    query={graphql`
                      query routes_RouteMapContainer_withTrip_Query(
                        $patternId: String!
                        $tripId: String!
                      ) {
                        pattern(id: $patternId) {
                          ...RouteMapContainer_pattern
                        }
                        trip(id: $tripId) {
                          ...RouteMapContainer_trip
                        }
                      }
                    `}
                  />
                </Route>
              </Route>
            ),
            content: [
              <Redirect to="/linjat/:routeId/pysakit" />,
              <Route path="pysakit">
                <Redirect to="/linjat/:routeId/pysakit/:routeId%3A0%3A01" />
                {/* Redirect to first pattern of route*/}
                <Route
                  path=":patternId"
                  getComponent={() =>
                    import(/* webpackChunkName: "route" */ './component/PatternStopsContainer').then(
                      getDefault,
                    )}
                  query={graphql`
                    query routes_PatternStopsContainer_Query(
                      $patternId: String!
                    ) {
                      pattern(id: $patternId) {
                        ...PatternStopsContainer_pattern
                      }
                    }
                  `}
                />
                <Route
                  path=":patternId/:tripId"
                  getComponent={() =>
                    import(/* webpackChunkName: "route" */ './component/TripStopsContainer').then(
                      getDefault,
                    )}
                  query={graphql`
                    query routes_TripStopsContainer_Query(
                      $patternId: String!
                      $tripId: String!
                    ) {
                      pattern(id: $patternId) {
                        ...TripStopsContainer_pattern
                      }
                      trip(id: $tripId) {
                        ...TripStopsContainer_trip
                      }
                    }
                  `}
                />
              </Route>,
              <Route path="aikataulu">
                <Redirect to="/linjat/:routeId/aikataulu/:routeId%3A0%3A01" />
                <Route
                  path=":patternId"
                  disableMapOnMobile
                  getComponent={() =>
                    import(/* webpackChunkName: "route" */ './component/RouteScheduleContainer').then(
                      getDefault,
                    )}
                  query={graphql`
                    query routes_RouteScheduleContainer_Query(
                      $patternId: String!
                    ) {
                      pattern(id: $patternId) {
                        ...RouteScheduleContainer_pattern
                      }
                    }
                  `}
                />
              </Route>,
              <Route
                path="hairiot"
                getComponent={() =>
                  import(/* webpackChunkName: "route" */ './component/RouteAlertsContainer').then(
                    getDefault,
                  )}
                query={graphql`
                  query routes_RouteAlertsContainer_Query($routeId: String!) {
                    route(id: $routeId) {
                      ...RouteAlertsContainer_route
                    }
                  }
                `}
              />,
            ],
          }}
        />
      </Route>
      <Route
        path="/reitti/:from/:to"
        groups={{
          title: (
            <Route
              getComponent={() =>
                import(/* webpackChunkName: "itinerary" */ './component/SummaryTitle').then(
                  getDefault,
                )}
            >
              <Route path=":hash" />
            </Route>
          ),
          content: (
            <Route
              getComponent={() =>
                import(/* webpackChunkName: "itinerary" */ './component/SummaryPage').then(
                  getDefault,
                )}
              query={graphql`
                query routes_Plan_Query(
                  $fromPlace: String!
                  $toPlace: String!
                  $intermediatePlaces: [InputCoordinates!]
                  $numItineraries: Int!
                  $modes: String
                  $date: String!
                  $time: String!
                  $walkReluctance: Float
                  $walkBoardCost: Int
                  $minTransferTime: Int
                  $walkSpeed: Float
                  $maxWalkDistance: Float
                  $wheelchair: Boolean
                  $disableRemainingWeightHeuristic: Boolean
                  $arriveBy: Boolean
                  $preferred: InputPreferred
                ) {
                  plan(
                    fromPlace: $fromPlace
                    toPlace: $toPlace
                    intermediatePlaces: $intermediatePlaces
                    numItineraries: $numItineraries
                    modes: $modes
                    date: $date
                    time: $time
                    walkReluctance: $walkReluctance
                    walkBoardCost: $walkBoardCost
                    minTransferTime: $minTransferTime
                    walkSpeed: $walkSpeed
                    maxWalkDistance: $maxWalkDistance
                    wheelchair: $wheelchair
                    disableRemainingWeightHeuristic: $disableRemainingWeightHeuristic
                    arriveBy: $arriveBy
                    preferred: $preferred
                  ) {
                    ...SummaryPage_plan
                  }
                }
              `}
              prepareVariables={preparePlanParams}
              render={({ Component, props, match }) => {
                if (!Component) {
                  return null;
                }
                return props
                  ? <Component {...props} />
                  : <Component {...match} plan={null} />;
              }}
            >
              <Route
                path=":hash"
                groups={{
                  content: (
                    <Route
                      getComponent={() =>
                        import(/* webpackChunkName: "itinerary" */ './component/ItineraryTab').then(
                          getDefault,
                        )}
                    />
                  ),
                  map: (
                    <Route
                      getComponent={() =>
                        import(/* webpackChunkName: "itinerary" */ './component/ItineraryPageMap').then(
                          getDefault,
                        )}
                    />
                  ),
                }}
              />
              }}
            </Route>
          ),
          meta: (
            <Route
              getComponent={() =>
                import(/* webpackChunkName: "itinerary" */ './component/SummaryPageMeta').then(
                  getDefault,
                )}
            >
              <Route path=":hash" />
            </Route>
          ),
        }}
      />
      <Route
        path="/styleguide"
        getComponent={() =>
          import(/* webpackChunkName: "styleguide" */ './component/StyleGuidePage')
            .then(getDefault)
            .catch(errorLoading)}
      />
      <Route
        path="/styleguide/component/:componentName"
        topBarOptions={{ hidden: true }}
        getComponent={() =>
          import(/* webpackChunkName: "styleguide" */ './component/StyleGuidePage')
            .then(getDefault)
            .catch(errorLoading)}
      />
      <Route
        path="/suosikki/uusi"
        getComponent={() =>
          import(/* webpackChunkName: "add-favourite" */ './component/AddFavouritePage')
            .then(getDefault)
            .catch(errorLoading)}
      />
      <Route
        path="/suosikki/muokkaa/:id"
        getComponent={() =>
          import(/* webpackChunkName: "add-favourite" */ './component/AddFavouritePage')
            .then(getDefault)
            .catch(errorLoading)}
      />
      <Route
        path="/tietoja-palvelusta"
        getComponent={() =>
          import(/* webpackChunkName: "about" */ './component/AboutPage').then(
            getDefault,
          )}
      />
      {/* For all the rest render 404 */}
      <Route path="*" Component={Error404} />
    </Route>
  );
};
