import Store from 'fluxible/addons/BaseStore';
import PropTypes from 'prop-types';
import { setMapLayerOptions, getMapLayerOptions } from './localStorage';

class MapLayerOptionsStore extends Store {
  static defaultMapLayerOptions = {
    maintenanceVehicles: {
      timeRange: 1440, // 1d
    },
  };

  static handlers = {
    UpdateMapLayerOptions: 'updateMapLayerOptions',
    ResetMapLayerOptions: 'resetMapLayerOptions',
  };

  static storeName = 'MapLayerOptionsStore';

  mapLayerOptions = { ...MapLayerOptionsStore.defaultMapLayerOptions };

  constructor(dispatcher) {
    super(dispatcher);

    this.initLayerOptions();
  }

  initLayerOptions = () => {
    const storedMapLayerOptions = getMapLayerOptions();

    this.mapLayerOptions = {
      ...MapLayerOptionsStore.defaultMapLayerOptions,
    };

    if (Object.keys(storedMapLayerOptions).length > 0) {
      this.mapLayerOptions = Object.keys(storedMapLayerOptions).reduce(
        (result, key) => {
          if (Object.keys(result).includes(key)) {
            return { ...result, ...{ [key]: storedMapLayerOptions[key] } };
          }
          return result;
        },
        this.mapLayerOptions,
      );
    }

    this.emitChange();
  };

  getMapLayerOptions = () => ({ ...this.mapLayerOptions });

  updateMapLayerOptions = mapLayerOptions => {
    this.mapLayerOptions = {
      ...this.mapLayerOptions,
      ...mapLayerOptions,
    };

    setMapLayerOptions({ ...this.mapLayerOptions });

    this.emitChange();
  };

  resetMapLayerOptions = () => {
    this.mapLayerOptions = {
      ...MapLayerOptionsStore.defaultMapLayerOptions,
    };

    setMapLayerOptions({ ...this.mapLayerOptions });

    this.emitChange();
  };
}

export const mapLayerOptionsShape = PropTypes.shape({
  maintenanceVehicles: PropTypes.shape({
    timeRange: PropTypes.number,
  }),
});

export default MapLayerOptionsStore;
