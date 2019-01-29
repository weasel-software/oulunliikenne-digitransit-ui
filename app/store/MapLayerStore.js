import Store from 'fluxible/addons/BaseStore';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  setMapLayerSettings,
  getMapLayerSettings,
  setMapLayerModeSpecificSettings,
  getMapLayerModeSpecificSettings,
} from './localStorage';

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
    tmsStations: true,
    roadConditions: true,
    fluencies: true,
  };

  static handlers = {
    UpdateMapLayers: 'updateMapLayers',
    UpdateMapLayersMode: 'updateMapLayersMode',
  };

  static storeName = 'MapLayerStore';

  mapLayers = { ...MapLayerStore.defaultLayers };
  mode = null;

  constructor(dispatcher) {
    super(dispatcher);

    // this.mode = 'CAR';

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
      this.mapLayers = { ...storedMapLayers };
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

  updateMapLayersMode = mode => {
    this.mode = mode;
    this.initLayers();
  };
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
  tmsStations: PropTypes.bool,
  roadConditions: PropTypes.bool,
  fluencies: PropTypes.bool,
});

export default MapLayerStore;
