import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';
import get from 'lodash/get';
import { intlShape } from 'react-intl';
import AgencyInfo from './AgencyInfo';

function LegAgencyInfo({ leg }, { config }) {
  const agencyName = get(leg, 'agency.name');
  const url = get(leg, 'agency.fareUrl') || get(leg, 'agency.url');
  const show = get(config, 'agency.show', false);
  if (show) {
    return (
      <div className="itinerary-leg-agency">
        <AgencyInfo url={url} agencyName={agencyName} />
      </div>
    );
  }
  return null;
}

LegAgencyInfo.contextTypes = {
  intl: intlShape.isRequired,
  config: PropTypes.object.isRequired,
};

LegAgencyInfo.propTypes = {
  leg: PropTypes.object,
};

export default createFragmentContainer(LegAgencyInfo, {
  leg: graphql`
    fragment LegAgencyInfo_leg on Leg {
      agency {
        name
        url
        fareUrl
      }
    }
  `,
});
