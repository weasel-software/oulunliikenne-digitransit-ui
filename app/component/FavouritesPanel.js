import PropTypes from 'prop-types';
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay/compat';
import connectToStores from 'fluxible-addons-react/connectToStores';
import FavouriteRouteListContainer from './FavouriteRouteListContainer';
import FavouriteLocationsContainer from './FavouriteLocationsContainer';
import NextDeparturesListHeader from './NextDeparturesListHeader';
import NoFavouritesPanel from './NoFavouritesPanel';
import Loading from './Loading';
import getEnvironment from '../relayEnvironment';

const FavouriteRoutes = ({ routes, currentTime }) => {
  if (routes.length > 0) {
    return (
      <QueryRenderer
        cacheConfig={{ force: true, poll: 30 * 1000 }}
        query={graphql.experimental`
          query FavouritesPanelQuery($ids: [String!], $currentTime: Long!) {
            routes(ids: $ids) {
              ...FavouriteRouteListContainer_routes
                @arguments(currentTime: $currentTime)
            }
          }
        `}
        variables={{ ids: routes, currentTime }}
        environment={getEnvironment()}
        render={({ props }) =>
          props
            ? <FavouriteRouteListContainer
                {...props}
                currentTime={currentTime}
              />
            : <Loading />}
      />
    );
  }
  return <NoFavouritesPanel />;
};

FavouriteRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
  currentTime: PropTypes.number.isRequired,
};

const FavouritesPanel = ({ routes, currentTime }) =>
  <div className="frontpage-panel">
    <FavouriteLocationsContainer />
    <NextDeparturesListHeader />
    <div className="scrollable momentum-scroll favourites">
      <FavouriteRoutes routes={routes} currentTime={currentTime} />
    </div>
  </div>;

FavouritesPanel.propTypes = {
  routes: PropTypes.array.isRequired,
  currentTime: PropTypes.number.isRequired,
};

export default connectToStores(
  FavouritesPanel,
  ['FavouriteRoutesStore', 'TimeStore'],
  context => ({
    routes: context.getStore('FavouriteRoutesStore').getRoutes(),
    currentTime: context.getStore('TimeStore').getCurrentTime().unix(),
  }),
);
