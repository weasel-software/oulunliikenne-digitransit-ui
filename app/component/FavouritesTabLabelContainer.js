import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import QueryRenderer from 'react-relay/lib/ReactRelayQueryRenderer';
import connectToStores from 'fluxible-addons-react/connectToStores';
import some from 'lodash/some';
import flatten from 'lodash/flatten';
import FavouritesTabLabel from './FavouritesTabLabel';
import getRelayEnvironment from '../util/getRelayEnvironment';

const hasDisruption = routes =>
  some(flatten(routes.map(route => route.alerts.length > 0)));

function FavouritesTabLabelContainer({ routes, relayEnvironment, ...rest }) {
  return (
    <QueryRenderer
      cacheConfig={{ force: true, poll: 30 * 1000 }}
      query={graphql`
        query FavouritesTabLabelContainerQuery($ids: [String]) {
          routes(ids: $ids) {
            alerts {
              id
            }
          }
        }
      `}
      variables={{ ids: routes }}
      environment={relayEnvironment}
      render={({ props }) =>
        <FavouritesTabLabel
          hasDisruption={props && hasDisruption(props.routes)}
          {...rest}
        />}
    />
  );
}

FavouritesTabLabelContainer.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  relayEnvironment: PropTypes.object.isRequired,
};

export default connectToStores(
  getRelayEnvironment(FavouritesTabLabelContainer),
  ['FavouriteRoutesStore'],
  context => ({
    routes: context.getStore('FavouriteRoutesStore').getRoutes(),
  }),
);
