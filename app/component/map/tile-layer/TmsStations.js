import { VectorTile } from '@mapbox/vector-tile';
import pick from 'lodash/pick';
import Protobuf from 'pbf';
import { drawTmsStationIcon } from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

export default class TmsStations {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.getPromise();
  }

  static getName = () => 'tmsStations';

  getPromise() {
    return fetch(
      `${this.config.URL.TMS_STATIONS_MAP}${this.tile.coords.z +
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

        if (vt.layers.tmsstations != null) {
          for (
            let i = 0, ref = vt.layers.tmsstations.length - 1;
            i <= ref;
            i++
          ) {
            const feature = vt.layers.tmsstations.feature(i);
            [[feature.geom]] = feature.loadGeometry();
            this.features.push(pick(feature, ['geom', 'properties']));
            drawTmsStationIcon(this.tile, feature.geom, this.imageSize);
          }
        }
      });
  }
}
