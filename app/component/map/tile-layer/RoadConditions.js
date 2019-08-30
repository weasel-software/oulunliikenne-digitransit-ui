import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import Relay from 'react-relay/classic';
import {
  drawRoadConditionIcon,
  drawRoadConditionPath,
} from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

const timeOfLastFetch = {};

export default class RoadConditions {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.fetchWithAction(this.fetchAndDrawStatus);
  }

  static getName = () => 'roadConditions';

  fetchWithAction = actionFn =>
    fetch(
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
        const featureList = [];
        if (vt.layers.roadconditions != null) {
          for (
            let i = 0, ref = vt.layers.roadconditions.length - 1;
            i <= ref;
            i++
          ) {
            const feature = vt.layers.roadconditions.feature(i);
            const geometryList = feature.loadGeometry();
            featureList.push({ geometryList, feature });
          }
        }
        featureList.forEach(actionFn);
      });

  fetchAndDrawStatus = ({ geometryList, feature }) => {
    const { id } = feature.properties;
    const query = Relay.createQuery(
      Relay.QL`
      query ($id: String!){
        roadCondition(id: $id) {
          roadConditionForecasts {
            forecastName
            type
            overallRoadCondition
          }
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

        if (result) {
          const { overallRoadCondition } = result.roadConditionForecasts[0];

          geometryList.forEach(geom => {
            if (
              this.config.roadConditions &&
              this.config.roadConditions.showLines &&
              geom.length > 1
            ) {
              let color = '#999999';

              if (this.config.roadConditions.colors) {
                if (this.config.roadConditions.colors[overallRoadCondition]) {
                  color = this.config.roadConditions.colors[
                    overallRoadCondition
                  ];
                } else if (this.config.roadConditions.colors.DEFAULT) {
                  color = this.config.roadConditions.colors.DEFAULT;
                }
              }

              drawRoadConditionPath(this.tile, geom, color);
              this.features.push({
                lineString: geom,
                geom: null,
                properties: feature.properties,
              });
            }

            if (
              this.config.roadConditions &&
              this.config.roadConditions.showIcons
            ) {
              const iconPoints = [geom[0], geom.slice(-1)[0]];
              iconPoints.forEach(point => {
                if (
                  point &&
                  point.x > 0 &&
                  point.y > 0 &&
                  point.x < feature.extent &&
                  point.y < feature.extent
                ) {
                  drawRoadConditionIcon(this.tile, point, this.imageSize);
                  if (!this.config.roadConditions.showLines) {
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
      return this;
    };

    if (lastFetch && currentTime - lastFetch <= 30000) {
      Relay.Store.primeCache({ query }, callback);
    } else {
      Relay.Store.forceFetch({ query }, callback);
    }
  };

  onTimeChange = () => {
    if (this.tile.coords.z > this.config.roadConditions.roadConditionsMinZoom) {
      this.fetchWithAction(this.fetchAndDrawStatus);
    }
  };
}
