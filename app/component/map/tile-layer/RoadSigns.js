import { VectorTile } from '@mapbox/vector-tile';
import pick from 'lodash/pick';
import Protobuf from 'pbf';
import {
  drawSpeedLimitRoadSignIcon,
  drawWarningRoadSignIcon,
  drawInformationRoadSignIcon,
} from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

export default class RoadSigns {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.getPromise();
  }

  static getName = () => 'roadSigns';

  getPromise() {
    return fetch(
      `${this.config.URL.ROAD_SIGNS_MAP}${this.tile.coords.z +
        (this.tile.props.zoomOffset || 0)}` +
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
        err => console.log(err), // eslint-disable-line no-console
      )
      .then(buf => {
        const vt = new VectorTile(new Protobuf(buf));
        this.features = [];
        if (vt.layers.roadsigns != null) {
          for (let i = 0, ref = vt.layers.roadsigns.length - 1; i <= ref; i++) {
            const feature = vt.layers.roadsigns.feature(i);

            [[feature.geom]] = feature.loadGeometry();
            this.features.push(pick(feature, ['geom', 'properties']));

            if (feature.properties.type === 'SPEEDLIMIT') {
              const speedLimit = feature.properties.displayValue;
              if (speedLimit !== 'null') {
                drawSpeedLimitRoadSignIcon(
                  this.tile,
                  feature.geom,
                  this.imageSize,
                  speedLimit,
                );
              }
            }

            if (feature.properties.type === 'INFORMATION') {
              drawInformationRoadSignIcon(
                this.tile,
                feature.geom,
                this.imageSize,
                feature.properties.severity,
              );
            }

            if (feature.properties.type === 'WARNING') {
              const warningType = feature.properties.displayValue;
              if (warningType && warningType !== 'null') {
                drawWarningRoadSignIcon(
                  this.tile,
                  feature.geom,
                  this.imageSize,
                  warningType,
                );
              }
            }
          }
        }
      });
  }
}
