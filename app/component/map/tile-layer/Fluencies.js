import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import get from 'lodash/get';
import { drawFluencyIcon, drawFluencyPath } from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

let timeOfLastUpdate = null;

export default class Fluencies {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.fetchWithAction(this.fetchAndDrawStatus);
  }

  static getName = () => 'fluencies';

  fetchWithAction = actionFn =>
    fetch(
      `${this.config.URL.FLUENCY_MAP}${this.tile.coords.z +
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
        const featureList = [];

        if (vt.layers.fluency != null) {
          for (let i = 0, ref = vt.layers.fluency.length - 1; i <= ref; i++) {
            const feature = vt.layers.fluency.feature(i);
            const geometryList = feature.loadGeometry();
            featureList.push({ geometryList, feature });
          }
        }
        featureList.forEach(actionFn);
      });

  fetchAndDrawStatus = ({ geometryList, feature }) => {
    timeOfLastUpdate = new Date().getTime();
    const { trafficFlow } = feature.properties;

    if (
      !get(feature, 'properties.name') &&
      !get(this.config, 'fluencies.showEmpty')
    ) {
      return;
    }

    geometryList.forEach(geom => {
      if (
        this.config.fluencies &&
        this.config.fluencies.showLines &&
        geom.length > 1
      ) {
        let color = '#999999';

        if (this.config.fluencies.colors) {
          if (this.config.fluencies.colors[trafficFlow]) {
            color = this.config.fluencies.colors[trafficFlow];
          } else if (this.config.fluencies.colors.DEFAULT) {
            color = this.config.fluencies.colors.DEFAULT;
          }
        }

        const { lineWidth } = this.config.fluencies;

        drawFluencyPath(this.tile, geom, color, lineWidth);

        this.features.push({
          lineString: geom,
          geom: null,
          properties: { name: '', ...feature.properties },
        });
      }

      if (this.config.fluencies && this.config.fluencies.showIcons) {
        const iconPoints = [geom[0], geom.slice(-1)[0]];
        iconPoints.forEach(point => {
          if (
            point &&
            point.x > 0 &&
            point.y > 0 &&
            point.x < feature.extent &&
            point.y < feature.extent
          ) {
            drawFluencyIcon(this.tile, point, this.imageSize);
            if (!this.config.fluencies.showLines) {
              this.features.push({
                geom: point,
                properties: { name: '', ...feature.properties },
              });
            }
          }
        });
      }
    });
  };

  onTimeChange = () => {
    if (this.tile.coords.z > this.config.fluencies.fluenciesMinZoom) {
      const currentTime = new Date().getTime();

      if (timeOfLastUpdate && currentTime - timeOfLastUpdate > 30000) {
        this.fetchWithAction(this.fetchAndDrawStatus);
      }
    }
  };
}
