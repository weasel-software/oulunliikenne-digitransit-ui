import { VectorTile } from '@mapbox/vector-tile';
import pick from 'lodash/pick';
import Protobuf from 'pbf';
import { drawRoadworkIcon } from '../../../util/mapIconUtils';
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
    ).then(res => {
      if (res.status !== 200) {
        return undefined;
      }

      return res.arrayBuffer().then(
        buf => {
          const vt = new VectorTile(new Protobuf(buf));

          this.features = [];

          if (vt.layers.roadworks != null) {
            for (let i = 0, ref = vt.layers.roadworks.length - 1; i <= ref; i++) {
              const feature = vt.layers.roadworks.feature(i);
              [[feature.geom]] = feature.loadGeometry();
              this.features.push(pick(feature, ['geom', 'properties']));
              drawRoadworkIcon(
                this.tile,
                feature.geom,
                this.imageSize,
              );
            }
          }
        },
        err => console.log(err),
      );
    });
  }
}
