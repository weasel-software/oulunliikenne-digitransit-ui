import PropTypes from 'prop-types';
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay/compat';
import { FormattedMessage } from 'react-intl';
import { routerShape } from 'found';

import Modal from './Modal';
import Loading from './Loading';
import DisruptionListContainer from './DisruptionListContainer';
import ComponentUsageExample from './ComponentUsageExample';
import { isBrowser } from '../util/browser';
import getRelayEnvironment from '../util/getRelayEnvironment';

function DisruptionInfo(props, context) {
  const isOpen = () =>
    context.location.state ? context.location.state.disruptionInfoOpen : false;

  const toggleVisibility = () => {
    if (isOpen()) {
      context.router.go(-1);
    } else {
      context.router.push({
        ...location,
        state: {
          ...location.state,
          disruptionInfoOpen: true,
        },
      });
    }
  };

  if (isBrowser && isOpen()) {
    return (
      <Modal
        open
        title={
          <FormattedMessage
            id="disruption-info"
            defaultMessage="Disruption info"
          />
        }
        toggleVisibility={toggleVisibility}
      >
        <QueryRenderer
          cacheConfig={{ force: true, poll: 30 * 1000 }}
          query={graphql.experimental`
            query DisruptionInfoQuery($feedIds: [String!]) {
              viewer {
                ...DisruptionListContainer_viewer @arguments(feedIds: $feedIds)
              }
            }
          `}
          variables={{ feedIds: context.config.feedIds }}
          environment={props.relayEnvironment}
          render={({ props: innerProps }) =>
            innerProps
              ? <DisruptionListContainer {...innerProps} />
              : <Loading />}
        />
      </Modal>
    );
  }
  return <div />;
}

DisruptionInfo.contextTypes = {
  router: routerShape.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
  }).isRequired,
  config: PropTypes.shape({
    feedIds: PropTypes.arrayOf(PropTypes.string.isRequired),
  }).isRequired,
  relayEnvironment: PropTypes.object.isRequired,
};

DisruptionInfo.description = () =>
  <div>
    <p>
      Modal that shows all available disruption info. Opened by
      DisruptionInfoButton.
      <strong>Deprecated:</strong> Will be removed in short future in favor of
      announcements page.
    </p>
    <ComponentUsageExample>
      <DisruptionInfo />
    </ComponentUsageExample>
  </div>;

export default getRelayEnvironment(DisruptionInfo);
