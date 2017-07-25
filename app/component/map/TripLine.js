import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';
import RouteLine from './route/RouteLine';

const TripLine = props => <RouteLine thin {...props} />;

TripLine.propTypes = {
  pattern: PropTypes.object,
  filteredStops: PropTypes.array,
};

export default createFragmentContainer(TripLine, {
  pattern: graphql`
    fragment TripLine_pattern on Trip {
      pattern {
        ...RouteLine_pattern
      }
    }
  `,
});
