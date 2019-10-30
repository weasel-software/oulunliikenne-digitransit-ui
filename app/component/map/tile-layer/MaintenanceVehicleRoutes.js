import { VectorTile } from '@mapbox/vector-tile';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import Protobuf from 'pbf';
import { drawMaintenanceVehicleRoutePath } from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';
import { MaintenanceJobColors, StreetMode } from '../../../constants';
import { getStreetMode } from '../../../util/modeUtils';

class MaintenanceVehicleRoutes {
  constructor(tile, config, layers, layerOptions, location) {
    this.tile = tile;
    this.config = config;
    this.timeRange = get(layerOptions, 'maintenanceVehicles.timeRange');
    const scaleRatio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleRatio;
    this.streetMode = getStreetMode(location, config);
    this.promise = this.getPromise();
  }

  static getName = () => 'maintenanceVehicles';

  getPromise = () => {
    const url =
      this.streetMode === StreetMode.Car
        ? this.config.URL.MAINTENANCE_VEHICLE_MOTORISED_MAP
        : this.config.URL.MAINTENANCE_VEHICLE_NON_MOTORISED_MAP;

    return fetch(
      `${url}${this.tile.coords.z + (this.tile.props.zoomOffset || 0)}` +
        `/${this.tile.coords.x}/${this.tile.coords.y}.pbf`,
    )
      .then(
        res => {
          if (res.status !== 200) {
            return undefined;
          }

          if (
            res.headers.has('x-protobuf-encoding') &&
            res.headers.get('x-protobuf-encoding') === 'base64'
          ) {
            return res.text().then(text => Buffer.from(text, 'base64'));
          }
          return res.arrayBuffer();
        },
        err => console.log(err),
      )
      .then(buf => {
        const vt = new VectorTile(new Protobuf(buf));
        this.features = [];

        const layerKey =
          this.streetMode === StreetMode.Car
            ? 'maintenanceroutesmotorised'
            : 'maintenanceroutesnonmotorised';

        if (vt.layers[layerKey] != null) {
          // Filter out any features that are not within the user selected time range.
          const tileLayerFeatures = [];
          const selectedTimeRange = ((Date.now() / 1000) - (this.timeRange * 60));
          for (let j = 0, ll = vt.layers[layerKey].length - 1; j <= ll; j++) {
            const feature = vt.layers[layerKey].feature(j);
            const { timestamp } = feature.properties;
            if (timestamp >= selectedTimeRange) {
              tileLayerFeatures.push(feature);
            }
          }

          // Sort the features by their ID first and those without will be put last.
          // Then filter only unique features by their hash value, removing any features
          // without an ID if there is one with that same hash.
          const sortedFeatures = sortBy(tileLayerFeatures, 'properties.id');
          const uniqueFeatures = uniqBy(sortedFeatures, 'properties.hash');

          // Draw the remaining features onto the map.
          for (let i = 0, ref = uniqueFeatures.length - 1; i <= ref; i++) {
            const feature = uniqueFeatures[i];
            const { jobId } = feature.properties;

            const color = MaintenanceJobColors[jobId] || MaintenanceJobColors[0];
            const geometryList = feature.loadGeometry();

            geometryList.forEach(geom => {
              if (
                this.config.maintenanceVehicles &&
                this.config.maintenanceVehicles.showLines &&
                geom.length > 1
              ) {
                drawMaintenanceVehicleRoutePath(this.tile, geom, color);

                this.features.push({
                  lineString: geom,
                  geom: null,
                  properties: feature.properties,
                });
              }
            });
          }
        }
      });
  };
}

export default MaintenanceVehicleRoutes;
