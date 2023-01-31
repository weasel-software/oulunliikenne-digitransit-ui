import PropTypes from 'prop-types';
import React from 'react';

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
import RoadConditions from './RoadConditions';
import MaintenanceVehicleRoutes, {
  RoadInspectionVehicleRoutes,
} from './MaintenanceVehicleRoutes';
import MaintenanceVehicleTail from './MaintenanceVehicleTail';
import Fluencies from './Fluencies';
import EcoCounters from './EcoCounters';
import RoadSigns from './RoadSigns';
import {
  BicycleRoutesBaana,
  BicycleRoutesBrand,
  BicycleRoutesMainRegional,
} from './BicycleRoutes';
import CityWeatherStations from './CityWeatherStations';

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
      if (config.roadConditions && config.roadConditions.showRoadConditions) {
        layers.push(RoadConditions);
      }

      if (
        config.maintenanceVehicles &&
        config.maintenanceVehicles.showMaintenanceVehicles
      ) {
        layers.push(MaintenanceVehicleRoutes);
      }

      if (
        config.realtimeMaintenanceVehicles &&
        config.realtimeMaintenanceVehicles.showRealtimeMaintenanceVehicles
      ) {
        layers.push(MaintenanceVehicleTail);
      }

      if (
        config.roadInspectionVehicles &&
        config.roadInspectionVehicles.showRoadInspectionVehicles
      ) {
        layers.push(RoadInspectionVehicleRoutes);
      }

      if (config.fluencies && config.fluencies.showFluencies) {
        layers.push(Fluencies);
      }

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

      if (
        config.parkingStations &&
        config.parkingStations.showParkingStations
      ) {
        layers.push(ParkingStations);
      }

      if (config.cameraStations && config.cameraStations.showCameraStations) {
        layers.push(CameraStations);
      }

      if (
        config.weatherStations &&
        config.weatherStations.showWeatherStations
      ) {
        layers.push(WeatherStations);
      }

      if (
        config.cityWeatherStations &&
        config.cityWeatherStations.showCityWeatherStations
      ) {
        layers.push(CityWeatherStations);
      }

      if (config.tmsStations && config.tmsStations.showTmsStations) {
        layers.push(TmsStations);
      }

      if (config.roadworks && config.roadworks.showRoadworks) {
        layers.push(Roadworks);
      }

      if (config.disorders && config.disorders.showDisorders) {
        layers.push(Disorders);
      }

      if (config.ecoCounters && config.ecoCounters.showEcoCounters) {
        layers.push(EcoCounters);
      }

      if (config.roadSigns && config.roadSigns.showRoadSigns) {
        layers.push(RoadSigns);
      }

      if (config.bicycleRoutes && config.bicycleRoutes.showBicycleRoutes) {
        layers.push(BicycleRoutesMainRegional);
        // Bicycle route types currently not needed.
        // Commented out instead of deleted in case
        // we need to re-enable them in the future.
        // layers.push(BicycleRouteTypes);
        layers.push(BicycleRoutesBaana);
        layers.push(BicycleRoutesBrand);
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
