import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import QueryRenderer from 'react-relay/lib/ReactRelayQueryRenderer';
import { routerShape } from 'found';
import DisruptionInfoButton from './DisruptionInfoButton';
import { isBrowser } from '../util/browser';
import getRelayEnvironment from '../util/getRelayEnvironment';

function DisruptionInfoButtonContainer(
  outerProps,
  { router, location, config: { feedIds } },
) {
  if (isBrowser) {
    const openDisruptionInfo = () => {
      router.push({
        ...location,
        state: {
          ...location.state,
          disruptionInfoOpen: true,
        },
      });
    };

    return (
      <QueryRenderer
        cacheConfig={{ force: true, poll: 30 * 1000 }}
        query={graphql.experimental`
          query DisruptionInfoButtonContainerQuery($feedIds: [String!]) {
            viewer {
              ...DisruptionInfoButton_viewer @arguments(feedIds: $feedIds)
            }
          }
        `}
        variables={{ feedIds }}
        environment={outerProps.relayEnvironment}
        render={({ props }) =>
          <DisruptionInfoButton
            viewer={null}
            {...props}
            toggleDisruptionInfo={openDisruptionInfo}
          />}
      />
    );
  }
  return <div />;
}

DisruptionInfoButtonContainer.contextTypes = {
  router: routerShape.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
  }).isRequired,
  config: PropTypes.shape({
    feedIds: PropTypes.arrayOf(PropTypes.string.isRequired),
  }).isRequired,
};

export default getRelayEnvironment(DisruptionInfoButtonContainer);
