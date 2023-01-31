import Store from 'fluxible/addons/BaseStore';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  setMapLayerSettings,
  getMapLayerSettings,
  setMapLayerModeSpecificSettings,
  getMapLayerModeSpecificSettings,
} from './localStorage';
import { getStreetMode } from '../util/modeUtils';

class MapLayerStore extends Store {
  static defaultLayers = {
    parkAndRide: true,
    stop: {
      bus: true,
      ferry: true,
      rail: true,
      subway: true,
      tram: true,
    },
    terminal: {
      bus: true,
      rail: true,
      subway: true,
    },
    ticketSales: {
      salesPoint: true,
      servicePoint: true,
      ticketMachine: true,
    },
    parkingStations: true,
    disorders: true,
    roadworks: true,
    cameraStations: true,
    weatherStations: true,
    cityWeatherStations: true,
    tmsStations: true,
    roadConditions: true,
    fluencies: true,
    maintenanceVehicles: true,
    realtimeMaintenanceVehicles: true,
    roadInspectionVehicles: true,
    roadSigns: true,
    bicycleRoutes: true,
    bicycleRoutesMainContract: true,
    bicycleRoutesMainRegional: true,
    bicycleRouteTypes: true,
    bicycleRoutesBaana: true,
    bicycleRoutesBrand: true,
  };

  static handlers = {
    UpdateMapLayers: 'updateMapLayers',
    ClearMapLayers: 'clearMapLayers',
    UpdateMapLayersMode: 'updateMapLayersMode',
    SetHighlightedStop: 'setHighlightedStop',
    RemoveHighlightedStop: 'removeHighlightedStop',
    SetHighlightedFluency: 'setHighlightedFluency',
    RemoveHighlightedFluency: 'removeHighlightedFluency',
  };

  static storeName = 'MapLayerStore';

  mapLayers = { ...MapLayerStore.defaultLayers };
  mode = null;
  highlightedStop = null;
  highlightedFluency = null;

  constructor(dispatcher) {
    super(dispatcher);

    const { config } = dispatcher.getContext();
    this.mode = getStreetMode(null, config);

    this.initLayers();
  }

  initLayers = () => {
    const { config } = this.getContext();

    if (config.useModeSpecificMapLayers && this.mode) {
      this.mapLayers = {
        ...get(
          config,
          `mapLayerDefaultsModeSpecific[${this.mode}]`,
          this.mapLayers,
        ),
      };
    }

    this.mapLayers.citybike =
      config.transportModes.citybike &&
      config.transportModes.citybike.availableForSelection;

    const storedMapLayers =
      config.useModeSpecificMapLayers && this.mode
        ? getMapLayerModeSpecificSettings(this.mode)
        : getMapLayerSettings();

    if (Object.keys(storedMapLayers).length > 0) {
      // Use the structure from config but the stored values (keeps things up to date when config is changed)
      this.mapLayers = Object.keys(storedMapLayers).reduce((result, key) => {
        if (Object.keys(result).includes(key)) {
          return { ...result, ...{ [key]: storedMapLayers[key] } };
        }
        return result;
      }, this.mapLayers);
    }
    this.emitChange();
  };

  getMapLayers = () => ({ ...this.mapLayers });

  updateMapLayers = mapLayers => {
    const { config } = this.getContext();

    this.mapLayers = {
      ...this.mapLayers,
      ...mapLayers,
    };

    if (config.useModeSpecificMapLayers && this.mode) {
      setMapLayerModeSpecificSettings(this.mode, { ...this.mapLayers });
    } else {
      setMapLayerSettings({ ...this.mapLayers });
    }

    this.emitChange();
  };

  clearMapLayers = () => {
    const clearedMapLayers = Object.keys(this.mapLayers).reduce(
      (result, key) => {
        if (key === 'stop') {
          const mapLayer = { [key]: { bus: false } };
          return { ...result, ...mapLayer };
        }
        return { ...result, [key]: false };
      },
      {},
    );

    this.updateMapLayers(clearedMapLayers);
  };

  updateMapLayersMode = mode => {
    if (this.mode !== mode) {
      this.mode = mode;
      this.initLayers();
    }
  };

  setHighlightedStop = stop => {
    this.highlightedStop = stop;
    this.emitChange();
  };

  removeHighlightedStop = () => {
    this.highlightedStop = null;
    this.emitChange();
  };

  getHighlightedStop = () => this.highlightedStop;

  setHighlightedFluency = fluency => {
    this.highlightedFluency = fluency;
    this.emitChange();
  };

  removeHighlightedFluency = () => {
    this.highlightedFluency = null;
    this.emitChange();
  };

  getHighlightedFluency = () => this.highlightedFluency;
}

export const mapLayerShape = PropTypes.shape({
  citybike: PropTypes.bool,
  parkAndRide: PropTypes.bool,
  stop: PropTypes.shape({
    bus: PropTypes.bool,
    ferry: PropTypes.bool,
    rail: PropTypes.bool,
    subway: PropTypes.bool,
    tram: PropTypes.bool,
  }),
  terminal: PropTypes.shape({
    bus: PropTypes.bool,
    rail: PropTypes.bool,
    subway: PropTypes.bool,
  }),
  ticketSales: PropTypes.shape({
    salesPoint: PropTypes.bool,
    servicePoint: PropTypes.bool,
    ticketMachine: PropTypes.bool,
  }),
  parkingStations: PropTypes.bool,
  disorders: PropTypes.bool,
  roadworks: PropTypes.bool,
  cameraStations: PropTypes.bool,
  weatherStations: PropTypes.bool,
  cityWeatherStations: PropTypes.bool,
  tmsStations: PropTypes.bool,
  roadConditions: PropTypes.bool,
  fluencies: PropTypes.bool,
  maintenanceVehicles: PropTypes.bool,
  realtimeMaintenanceVehicles: PropTypes.bool,
  roadInspectionVehicles: PropTypes.bool,
  roadSigns: PropTypes.bool,
  bicycleRoutes: PropTypes.bool,
  bicycleRoutesMainContract: PropTypes.bool,
  bicycleRoutesMainRegional: PropTypes.bool,
  bicycleRouteTypes: PropTypes.bool,
  bicycleRoutesBaana: PropTypes.bool,
  bicycleRoutesBrand: PropTypes.bool,
});

export default MapLayerStore;
