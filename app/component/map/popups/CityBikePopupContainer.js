import React from 'react';
import PropTypes from 'prop-types';

import { QueryRenderer, graphql } from 'react-relay/compat';

import CityBikePopup from '../popups/CityBikePopup';
import Loading from '../../Loading';
import getRelayEnvironment from '../../../util/getRelayEnvironment';

function StopMarkerPopupContainer(props) {
  return (
    <QueryRenderer
      query={graphql`
        query CityBikePopupContainerQuery($stationId: String!) {
          station: bikeRentalStation(id: $stationId) {
            ...CityBikePopup_station
          }
        }
      `}
      cacheConfig={{ force: true, poll: 30 * 1000 }}
      variables={{ stationId: props.stationId }}
      environment={props.relayEnvironment}
      render={({ props: renderProps }) =>
        renderProps
          ? <CityBikePopup {...renderProps} />
          : <div className="card" style={{ height: '12rem' }}>
              <Loading />
            </div>}
    />
  );
}

StopMarkerPopupContainer.propTypes = {
  stationId: PropTypes.string.isRequired,
  relayEnvironment: PropTypes.object.isRequired,
};

export default getRelayEnvironment(StopMarkerPopupContainer);
