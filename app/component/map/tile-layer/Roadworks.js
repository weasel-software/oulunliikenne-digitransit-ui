import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import {
  drawRoadworkIcon,
  drawRoadworkPath,
  // drawPathWithCircles,
} from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

export default class Roadworks {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.getPromise();
  }

  static getName = () => 'roadworks';

  getPromise() {
    return fetch(
      `${this.config.URL.ROADWORKS_MAP}${this.tile.coords.z +
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

        if (vt.layers.roadworks != null) {
          for (let i = 0, ref = vt.layers.roadworks.length - 1; i <= ref; i++) {
            const feature = vt.layers.roadworks.feature(i);
            const geometryList = feature.loadGeometry();

            for (
              let j = 0, geomListRef = geometryList.length;
              j < geomListRef;
              j++
            ) {
              const geometry = geometryList[j];

              if (this.config.roadworks && this.config.roadworks.showIcons) {
                for (let k = 0, geomRef = geometry.length; k < geomRef; k++) {
                  const geom = geometry[k];
                  if (
                    geom.x > 0 &&
                    geom.y > 0 &&
                    geom.x < feature.extent &&
                    geom.y < feature.extent
                  ) {
                    if (!this.config.roadworks.showLines) {
                      this.features.push({
                        geom,
                        properties: feature.properties,
                      });
                    }
                    drawRoadworkIcon(this.tile, geom, this.imageSize);
                  }
                }
              }

              if (
                this.config.roadworks &&
                this.config.roadworks.showLines &&
                geometry.length
              ) {
                drawRoadworkPath(this.tile, geometry);

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
                      const goalDist = Math.sqrt(
                        deltaX * deltaX + deltaY * deltaY,
                      );

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
          }
        }
      });
  }
}
