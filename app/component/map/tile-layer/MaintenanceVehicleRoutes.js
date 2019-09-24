import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import { drawMaintenanceVehicleRoutePath } from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';
import { MaintenanceJobColors, StreetMode } from '../../../constants';
import { getStreetMode } from '../../../util/modeUtils';

class MaintenanceVehicleRoutes {
  constructor(tile, config, layers, location) {
    this.tile = tile;
    this.config = config;
    const scaleRatio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleRatio;
    this.promise = this.fetchWithAction(this.fetchAndDrawStatus);
    this.streetMode = getStreetMode(location, config);
  }

  static getName = () => 'maintenanceVehicles';

  fetchWithAction = actionFn => {
    const url =
      this.streetMode === StreetMode.CAR
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
        const featureList = [];

        const layerKey = StreetMode.CAR
          ? 'maintenanceroutesmotorised'
          : 'maintenanceroutesnonmotorised';

        if (vt.layers[layerKey] != null) {
          for (let i = 0, ref = vt.layers[layerKey].length - 1; i <= ref; i++) {
            const feature = vt.layers[layerKey].feature(i);
            const geometryList = feature.loadGeometry();
            featureList.push({ geometryList, feature });
          }
        }
        featureList.forEach(actionFn);
      });
  };

  fetchAndDrawStatus = ({ geometryList, feature }) => {
    const { jobId } = feature.properties;
    const color = MaintenanceJobColors[jobId] || MaintenanceJobColors[0];

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
  };

  onTimeChange = () => {
    if (
      this.tile.coords.z >
      this.config.maintenanceVehicles.maintenanceVehiclesMinZoom
    ) {
      this.fetchWithAction(this.fetchAndDrawStatus);
    }
  };
}

export default MaintenanceVehicleRoutes;
