import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import shouldUpdate from 'recompose/shouldUpdate';

import FavouriteRouteListContainer from './FavouriteRouteListContainer';
import FavouriteLocationsContainer from './FavouriteLocationsContainer';
import NextDeparturesListHeader from './NextDeparturesListHeader';
import NoFavouritesPanel from './NoFavouritesPanel';
import Loading from './Loading';
import PanelOrSelectLocation from './PanelOrSelectLocation';
import { dtLocationShape } from '../util/shapes';
import { TAB_FAVOURITES } from '../util/path';
import withBreakpoint from '../util/withBreakpoint';
import { isBrowser } from '../util/browser';

class FavouriteRouteListContainerRoute extends Relay.Route {
  static queries = {
    routes: (Component, variables) => Relay.QL`
      query {
        routes (feeds:$feeds) {
          ${Component.getFragment('routes', {
            feeds: variables.feeds,
          })}
    }}`,
  };
  static paramDefinitions = {
    feeds: { required: true },
  };
  static routeName = 'FavouriteRouteRowRoute';
}

const FavouriteRoutes = ({ routes, origin }) => (
  <Relay.RootContainer
    Component={FavouriteRouteListContainer}
    forceFetch
    route={
      new FavouriteRouteListContainerRoute({
        ids: routes,
        origin,
      })
    }
    renderLoading={Loading}
  />
);

FavouriteRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
  origin: dtLocationShape.isRequired,
};

const FavouritesPanel = ({
  origin,
  routes,
  currentTime,
  favouriteLocations,
  favouriteStops,
  breakpoint,
}) =>
  isBrowser && (
    <div className="frontpage-panel">
      <FavouriteLocationsContainer
        origin={origin}
        currentTime={currentTime}
        favourites={[...favouriteLocations, ...favouriteStops]}
      />
      <div
        className={`nearby-table-container ${breakpoint !== 'large' &&
          `mobile`}`}
      >
        {routes.length > 0 ? (
          <table className="nearby-departures-table">
            <thead>
              <NextDeparturesListHeader />
            </thead>
            <tbody>
              <FavouriteRoutes routes={routes} origin={origin} />
            </tbody>
          </table>
        ) : (
          <NoFavouritesPanel />
        )}
      </div>
    </div>
  );

FavouritesPanel.propTypes = {
  routes: PropTypes.array.isRequired,
  origin: dtLocationShape.isRequired, // eslint-disable-line react/no-typos
  currentTime: PropTypes.number.isRequired,
  favouriteLocations: PropTypes.array,
  favouriteStops: PropTypes.array,
  breakpoint: PropTypes.string.isRequired,
};

const FilteredFavouritesPanel = shouldUpdate(
  (props, nextProps) =>
    nextProps.currentTime !== props.currentTime ||
    nextProps.routes !== props.routes ||
    nextProps.favouriteLocations !== props.favouriteLocations ||
    nextProps.favouriteStops !== props.favouriteStops ||
    nextProps.origin.gps !== props.origin.gps ||
    (!nextProps.origin.gps &&
      (nextProps.origin.lat !== props.origin.lat ||
        nextProps.origin.lon !== props.origin.lon)),
)(withBreakpoint(FavouritesPanel));

export default connectToStores(
  ctx => (
    <PanelOrSelectLocation
      panel={FilteredFavouritesPanel}
      panelctx={{ ...ctx, tab: TAB_FAVOURITES }}
    />
  ),
  [
    'FavouriteRoutesStore',
    'TimeStore',
    'FavouriteLocationStore',
    'FavouriteStopsStore',
  ],
  context => ({
    routes: context.getStore('FavouriteRoutesStore').getRoutes(),
    currentTime: context
      .getStore('TimeStore')
      .getCurrentTime()
      .unix(),
    favouriteLocations: context
      .getStore('FavouriteLocationStore')
      .getLocations(),
    favouriteStops: context.getStore('FavouriteStopsStore').getStops(),
  }),
);
