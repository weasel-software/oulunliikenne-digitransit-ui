import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import MarkerPopupBottom from '../MarkerPopupBottom';
import ParkingStationAvailability from './ParkingStationAvailability';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';

class ParkingStationPopup extends React.Component {
  static contextTypes = { intl: intlShape.isRequired };

  static description = (
    <div>
      <p>Renders a ParkingStation popup.</p>
      <ComponentUsageExample description="">
        <ParkingStationPopup context="context object here">
          Im content of a ParkingStation card
        </ParkingStationPopup>
      </ComponentUsageExample>
    </div>
  );

  static propTypes = {
    station: PropTypes.object.isRequired,
  };

  render() {
    const {station: {name, spacesAvailable, maxCapacity, realtime, lon, lat}} = this.props;

    return (
      <div className="card">
        <Card className="padding-small">
          <CardHeader
            name={this.context.intl.formatMessage({
              id: 'parking',
              defaultMessage: 'Parking',
            })}
            description={name}
            icon="icon-icon_parking-station"
            unlinked
          />
          {realtime &&
            <ParkingStationAvailability
              realtime={realtime}
              maxCapacity={maxCapacity}
              spacesAvailable={spacesAvailable}
            />
          }
        </Card>
        <MarkerPopupBottom
          location={{
            address: name,
            lat: lat,
            lon: lon,
          }}
        />
      </div>
    );
  }
}

export default Relay.createContainer(ParkingStationPopup, {
  fragments: {
    station: () => Relay.QL`
      fragment on CarPark {
        name
        spacesAvailable
        maxCapacity
        realtime
        lon
        lat
      }
    `,
  },
});
