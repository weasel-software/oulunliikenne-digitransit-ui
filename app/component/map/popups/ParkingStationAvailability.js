import PropTypes from 'prop-types';
import React from 'react';
import mapProps from 'recompose/mapProps';
import { FormattedMessage } from 'react-intl';

import Availability from '../../Availability';
import ComponentUsageExample from '../../ComponentUsageExample';

const ParkingStationAvailability = mapProps(
  ({ realtime, maxCapacity, spacesAvailable, fewAvailableCount }) => ({
    available: realtime ? spacesAvailable : 0,
    total: maxCapacity,
    fewAvailableCount,
    text: (
      <p className="sub-header-h4 availability-header">
        <FormattedMessage
          id="parking-availability"
          defaultMessage="Spaces available"
        />
        {'\u00a0'}
        ({!realtime || Number.isNaN(spacesAvailable) ? '?' : spacesAvailable}/
        {Number.isNaN(maxCapacity) ? 0 : maxCapacity})
      </p>
    ),
  }),
)(Availability);

ParkingStationAvailability.displayName = 'ParkingStationAvailability';

ParkingStationAvailability.description = (
  <div>
    <p>Renders information about parking station availability</p>
    <ComponentUsageExample description="non-realtime">
      <ParkingStationAvailability spacesAvailable={1} maxCapacity={3} />
    </ComponentUsageExample>
    <ComponentUsageExample description="realtime">
      <ParkingStationAvailability realtime spacesAvailable={1} maxCapacity={3} />
    </ComponentUsageExample>
  </div>
);

ParkingStationAvailability.propTypes = {
  realtime: PropTypes.bool,
  maxCapacity: PropTypes.number.isRequired,
  spacesAvailable: PropTypes.number.isRequired,
  fewAvailableCount: PropTypes.number.isRequired,
};

export default ParkingStationAvailability;
