import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import Relay from 'react-relay/classic';
import {
  drawParkingStationIcon,
  drawAvailabilityValue,
  drawAvailabilityBadge,
} from '../../../util/mapIconUtils';
import pick from 'lodash/pick';
import { isBrowser } from '../../../util/browser';

const timeOfLastFetch = {};

export default class ParkingStations {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    this.scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * this.scaleratio;
    this.availabilityImageSize = 13 * this.scaleratio;

    this.promise = this.fetchWithAction(this.fetchAndDrawStatus);
  }

  static getName = () => 'parkingStations';

  fetchWithAction = actionFn =>
    fetch(
      `${this.config.URL.PARKING_STATIONS_MAP}${this.tile.coords.z +
        (this.tile.props.zoomOffset || 0)}` +
        `/${this.tile.coords.x}/${this.tile.coords.y}.pbf`,
    ).then(res => {
        if (res.status !== 200) {
          return undefined;
        }

        if (res.headers.has('x-protobuf-encoding') && res.headers.get('x-protobuf-encoding') === 'base64') {
          return res.text().then(text => Buffer.from(text, 'base64'));
        }
        return res.arrayBuffer();
      },
      err => console.log(err),
    ).then(buf => {
      const vt = new VectorTile(new Protobuf(buf));

      this.features = [];

      if (vt.layers.carparks != null) {
        for (let i = 0, ref = vt.layers.carparks.length - 1; i <= ref; i++) {
          const feature = vt.layers.carparks.feature(i);
          [[feature.geom]] = feature.loadGeometry();
          this.features.push(pick(feature, ['geom', 'properties']));
          drawParkingStationIcon(
            this.tile,
            feature.geom,
            this.imageSize,
          );
        }
      }

      this.features.forEach(actionFn);
    });

  fetchAndDrawStatus = ({ geom, properties: { id } }) => {
    const query = Relay.createQuery(
      Relay.QL`
      query ($id: String!){
        carPark(id: $id) {
          spacesAvailable
          maxCapacity
          realtime
        }
      }`,
      { id },
    );

    const lastFetch = timeOfLastFetch[id];
    const currentTime = new Date().getTime();

    const callback = readyState => {
      if (readyState.done) {
        timeOfLastFetch[id] = new Date().getTime();
        const result = Relay.Store.readQuery(query)[0];

        if (result && result.realtime && this.tile.coords.z >= this.config.parkingStations.smallIconMinZoom) {
          const availabilityIndex = (result.spacesAvailable > 0 ? (result.spacesAvailable > (result.maxCapacity * (this.config.parkingStations.availabilityThreshold || 0.25)) ? 0 : 1) : 2);
          const value = ['', result.spacesAvailable, 'X'][availabilityIndex];
          const color = ['green', 'orange', 'red'][availabilityIndex];

          drawAvailabilityValue(
            this.tile,
            geom,
            value,
            this.imageSize,
            this.availabilityImageSize,
            this.scaleratio,
            color
          );
        }
      }
      return this;
    };

    if (lastFetch && currentTime - lastFetch <= 30000) {
      Relay.Store.primeCache({ query }, callback);
    } else {
      Relay.Store.forceFetch({ query }, callback);
    }
  };
}
