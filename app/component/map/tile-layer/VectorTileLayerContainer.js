import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';

import TileLayerContainer from './TileLayerContainer';
import CityBikes from './CityBikes';
import Stops from './Stops';
import ParkAndRide from './ParkAndRide';
import TicketSales from './TicketSales';
import ParkingStations from './ParkingStations';
import CameraStations from './CameraStations';
import Roadworks from './Roadworks';
import Disorders from './Disorders';
import WeatherStations from './WeatherStations';
import TmsStations from './TmsStations';

class VectorTileLayerContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  navbarSettingsEnabled = item => {
    const { navbarSettings } = this.props;
    return !navbarSettings || navbarSettings[item] !== false;
  };

  render() {
    const { showStops, hilightedStops, disableMapTracking } = this.props;
    const { config } = this.context;
    const layers = [];

    if (showStops) {
      layers.push(Stops);

      if (
        config.cityBike &&
        config.cityBike.showCityBikes &&
        this.navbarSettingsEnabled('cityBikes')
      ) {
        layers.push(CityBikes);
      }

      if (
        config.parkingStations &&
        config.parkingStations.showParkingStations &&
        this.navbarSettingsEnabled('parking')
      ) {
        layers.push(ParkingStations);
      }

      if (
        config.cameraStations &&
        config.cameraStations.showCameraStations &&
        this.navbarSettingsEnabled('cameras')
      ) {
        layers.push(CameraStations);
      }

      if (
        config.parkAndRide &&
        config.parkAndRide.showParkAndRide &&
        this.navbarSettingsEnabled('parkAndRide')
      ) {
        layers.push(ParkAndRide);
      }

      if (
        config.ticketSales &&
        config.ticketSales.showTicketSales &&
        this.navbarSettingsEnabled('ticketSales')
      ) {
        layers.push(TicketSales);
      }

      if (
        config.roadworks &&
        config.roadworks.showRoadworks &&
        this.navbarSettingsEnabled('roadworks')
      ) {
        layers.push(Roadworks);
      }
      if (
        config.disorders &&
        config.disorders.showDisorders &&
        this.navbarSettingsEnabled('disruptions')
      ) {
        layers.push(Disorders);
      }

      if (
        config.weatherStations &&
        config.weatherStations.showWeatherStations &&
        this.navbarSettingsEnabled('weatherStations')
      ) {
        layers.push(WeatherStations);
      }

      if (
        config.tmsStations &&
        config.tmsStations.showTmsStations &&
        this.navbarSettingsEnabled('tmsStations')
      ) {
        layers.push(TmsStations);
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
  navbarSettings: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

VectorTileLayerContainer.contextTypes = {
  config: PropTypes.object.isRequired,
};

export default connectToStores(
  VectorTileLayerContainer,
  ['NavbarSettingsStore'],
  context => ({
    navbarSettings: context.getStore('NavbarSettingsStore').getNavbarSettings(),
  }),
);
