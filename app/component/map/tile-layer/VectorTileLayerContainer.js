import PropTypes from 'prop-types';
import React from 'react';

import TileLayerContainer from './TileLayerContainer';
import CityBikes from './CityBikes';
import Stops from './Stops';
import ParkAndRide from './ParkAndRide';
import TicketSales from './TicketSales';

class VectorTileLayerContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { showStops, hilightedStops, disableMapTracking } = this.props;
    const { config } = this.context;
    const layers = [];

    if (showStops) {
      layers.push(Stops);

      if (config.cityBike && config.cityBike.showCityBikes) {
        layers.push(CityBikes);
      }

      if (config.parkAndRide && config.parkAndRide.showParkAndRide) {
        layers.push(ParkAndRide);
      }

      if (config.ticketSales && config.ticketSales.showTicketSales) {
        layers.push(TicketSales);
      }
    }

    return (
      <TileLayerContainer
        key="tileLayer"
        layers={layers}
        hilightedStops={hilightedStops}
        tileSize={config.map.tileSize || 256}
        zoomOffset={config.map.zoomOffset || 0}
        disableMapTracking={disableMapTracking}
      />
    );
  }
}

VectorTileLayerContainer.propTypes = {
  hilightedStops: PropTypes.arrayOf(PropTypes.string.isRequired),
  disableMapTracking: PropTypes.func,
  showStops: PropTypes.bool,
};

VectorTileLayerContainer.contextTypes = {
  config: PropTypes.object.isRequired,
};

export default VectorTileLayerContainer;
