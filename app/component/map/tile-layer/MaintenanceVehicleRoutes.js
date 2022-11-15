import { VectorTile } from '@mapbox/vector-tile';
import get from 'lodash/get';
import Protobuf from 'pbf';
import { drawMaintenanceVehicleRoutePath } from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';
import {
  MaintenanceJobColors,
  StreetMode,
  RoadInspectionJobId,
  ContractTypes,
} from '../../../constants';
import { getStreetMode } from '../../../util/modeUtils';
import { getTileLayerFeaturesToRender } from '../../../util/maintenanceUtils';

class MaintenanceVehicleRoutes {
  constructor(tile, config, layers, layerOptions, location) {
    this.onlyInspectionJob = false;
    this.tile = tile;
    this.config = config;
    this.timeRange = get(layerOptions, 'maintenanceVehicles.timeRange');
    this.brushingFor30days = get(
      layerOptions,
      'maintenanceVehicles.brushingFor30days',
    );
    const scaleRatio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleRatio;
    this.streetMode = getStreetMode(location, config);
    this.promise = this.getPromise();

    this.bicycleRoutesMainContract = get(layers, 'bicycleRoutesMainContract');
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
        // eslint-disable-next-line
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
          const featureArray = vt.layers[layerKey];
          const uniqueFeatures = getTileLayerFeaturesToRender({
            featureArray,
            timeRange: this.timeRange,
            includeOnlyInspectionJob: this.onlyInspectionJob,
            includeOnlyBrushingJobs: this.brushingFor30days,
            includeOnlyContractType: this.bicycleRoutesMainContract
              ? ContractTypes.Oulu
              : false,
          });

          // Draw the remaining features onto the map.
          for (let i = 0, ref = uniqueFeatures.length - 1; i <= ref; i++) {
            const feature = uniqueFeatures[i];
            const { jobId, vehicleType } = feature.properties;

            // inspection jobs have the same jobId but must render a different
            // colour based on vehicleType (when undefined default to car)
            let colorKey = jobId;
            if (this.onlyInspectionJob && jobId === RoadInspectionJobId) {
              const inspectionVehicleType =
                typeof vehicleType === 'string'
                  ? vehicleType.toLowerCase()
                  : 'car';
              colorKey = `${jobId}-${inspectionVehicleType}`;
            }
            const color =
              MaintenanceJobColors[colorKey] || MaintenanceJobColors[0];
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

export class RoadInspectionVehicleRoutes extends MaintenanceVehicleRoutes {
  constructor(tile, config, layers, layerOptions, location) {
    super(tile, config, layers, layerOptions, location);
    this.onlyInspectionJob = true;
    this.brushingFor30days = false;
  }
  static getName = () => 'roadInspectionVehicles';
}

export default MaintenanceVehicleRoutes;
