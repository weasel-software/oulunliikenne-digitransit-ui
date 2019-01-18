import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import get from 'lodash/get';
import {
  drawFluencyIcon,
  drawFluencyPath,
  // drawPathWithCircles,
} from '../../../util/mapIconUtils';
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

    if (!get(feature, 'properties.name')) {
      // eslint-disable-next-line no-param-reassign
      feature.properties = { ...feature.properties, name: '' };
    }

    for (let j = 0, geomListRef = geometryList.length; j < geomListRef; j++) {
      const geometry = geometryList[j];

      if (this.config.fluencies && this.config.fluencies.showIcons) {
        for (let k = 0, geomRef = geometry.length; k < geomRef; k++) {
          const geom = geometry[k];
          if (
            geom.x > 0 &&
            geom.y > 0 &&
            geom.x < feature.extent &&
            geom.y < feature.extent
          ) {
            if (k === 0 || k === geomRef - 1) {
              if (!this.config.fluencies.showLines) {
                this.features.push({
                  geom,
                  properties: feature.properties,
                });
              }
              drawFluencyIcon(this.tile, geom, this.imageSize);
            }
          }
        }
      }

      if (
        this.config.fluencies &&
        this.config.fluencies.showLines &&
        geometry.length
      ) {
        let color = '#999999';

        if (
          this.config.fluencies.colors &&
          this.config.fluencies.colors[trafficFlow]
        ) {
          color = this.config.fluencies.colors[trafficFlow];
        } else if (
          this.config.fluencies.colors &&
          this.config.fluencies.colors.DEFAULT
        ) {
          color = this.config.fluencies.colors.DEFAULT;
        }

        drawFluencyPath(this.tile, geometry, color);

        const treshold = 200;
        const fillPoints = geometry
          .map((point, index, array) => {
            let currentPoint = point;
            const nextPoint = array[index + 1];
            const pointList = [{ ...point }];

            if (!nextPoint) {
              return pointList;
            }

            while (currentPoint) {
              const deltaX = nextPoint.x - currentPoint.x;
              const deltaY = nextPoint.y - currentPoint.y;
              const goalDist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

              if (goalDist > treshold) {
                const ratio = treshold / goalDist;
                const Xmove = ratio * deltaX;
                const Ymove = ratio * deltaY;
                const newPoint = {
                  x: Xmove + currentPoint.x,
                  y: Ymove + currentPoint.y,
                };
                pointList.push(newPoint);
                currentPoint = newPoint;
              } else {
                currentPoint = false;
              }
            }

            return pointList;
          })
          .flat();

        // To visualise the fill point on the path uncomment the following line
        // drawPathWithCircles(this.tile, fillPoints);

        this.features.push({
          lineString: fillPoints,
          geom: null,
          properties: feature.properties,
        });
      }
    }
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
