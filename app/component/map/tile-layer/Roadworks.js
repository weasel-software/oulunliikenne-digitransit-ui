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
            console.log(feature.properties);
            const geometryList = feature.loadGeometry();

            for (
              let j = 0, geomListRef = geometryList.length;
              j < geomListRef;
              j++
            ) {
              const geometry = geometryList[j];
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
                  drawRoadworkIcon(this.tile, geom, this.imageSize);
                }
                points.push(geom);
              }

              if (this.config.roadworks.showLines && points.length) {
                drawRoadworkPath(this.tile, points);
              }
            }
          }
        }
      });
  }
}
