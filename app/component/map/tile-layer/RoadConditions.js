import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import get from 'lodash/get';
import {
  drawRoadConditionIcon,
  drawRoadConditionPath,
} from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

export default class RoadConditions {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.getPromise();
  }

  static getName = () => 'roadConditions';

  getPromise() {
    return fetch(
      `${this.config.URL.ROAD_CONDITIONS_MAP}${this.tile.coords.z +
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
        err => console.log(err),
      )
      .then(buf => {
        const vt = new VectorTile(new Protobuf(buf));

        this.features = [];

        if (vt.layers.roadconditions != null) {
          for (
            let i = 0, ref = vt.layers.roadconditions.length - 1;
            i <= ref;
            i++
          ) {
            const feature = vt.layers.roadconditions.feature(i);
            const geometryList = feature.loadGeometry();

            for (
              let j = 0, geomListRef = geometryList.length;
              j < geomListRef;
              j++
            ) {
              const geometry = geometryList[j];
              const icons = [];
              const points = [];
              for (let k = 0, geomRef = geometry.length; k < geomRef; k++) {
                const geom = geometry[k];
                if (
                  geom.x > 0 &&
                  geom.y > 0 &&
                  geom.x < feature.extent &&
                  geom.y < feature.extent
                ) {
                  this.features.push({ geom, properties: feature.properties });
                  if (
                    this.config.roadConditions &&
                    this.config.roadConditions.showIcons
                  ) {
                    if (k === 0 || k === geomRef - 1) {
                      drawRoadConditionIcon(this.tile, geom, this.imageSize);
                    }
                    icons.push(geom);
                  }
                }
                points.push(geom);
              }

              if (
                this.config.roadConditions &&
                this.config.roadConditions.showLines &&
                points.length
              ) {
                let color = '#999999';
                const overallRoadCondition = get(
                  feature,
                  'properties.overallRoadCondition',
                );

                if (
                  this.config.roadConditions.colors &&
                  this.config.roadConditions.colors[overallRoadCondition]
                ) {
                  color = this.config.roadConditions.colors[
                    overallRoadCondition
                  ];
                } else if (
                  this.config.roadConditions.colors &&
                  this.config.roadConditions.colors.DEFAULT
                ) {
                  color = this.config.roadConditions.colors.DEFAULT;
                }

                drawRoadConditionPath(this.tile, points, color);
              }
            }
          }
        }
      });
  }
}
