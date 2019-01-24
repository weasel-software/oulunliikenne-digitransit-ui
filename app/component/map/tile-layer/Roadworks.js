import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import { drawRoadworkIcon, drawRoadworkPath } from '../../../util/mapIconUtils';
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

            geometryList.forEach(geom => {
              if (
                this.config.roadworks &&
                this.config.roadworks.showLines &&
                geom.length > 1
              ) {
                drawRoadworkPath(this.tile, geom);
                this.features.push({
                  lineString: geom,
                  geom: null,
                  properties: feature.properties,
                });
              }

              if (this.config.roadworks && this.config.roadworks.showIcons) {
                geom.forEach(point => {
                  if (
                    point &&
                    point.x > 0 &&
                    point.y > 0 &&
                    point.x < feature.extent &&
                    point.y < feature.extent
                  ) {
                    drawRoadworkIcon(this.tile, point, this.imageSize);
                    if (!this.config.roadworks.showLines) {
                      this.features.push({
                        geom: point,
                        properties: feature.properties,
                      });
                    }
                  }
                });
              }
            });
          }
        }
      });
  }
}
