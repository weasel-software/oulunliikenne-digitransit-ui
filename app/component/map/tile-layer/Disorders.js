import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import Relay from 'react-relay/classic';
import get from 'lodash/get';
import centerOfMass from '@turf/center-of-mass';
import { polygon as turfPolygon } from '@turf/helpers';
import moment from 'moment';
import { getStreetMode } from '../../../util/modeUtils';

import {
  drawDisorderIcon,
  drawDisorderPath,
  drawDisorderPolygon,
} from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

const timeOfLastFetch = {};

export default class Disorders {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.getPromise();
  }

  static getName = () => 'disorders';

  getPromise = () =>
    fetch(
      `${this.config.URL.DISORDERS_MAP}${this.tile.coords.z +
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

        if (vt.layers.disruptions != null) {
          for (
            let i = 0, ref = vt.layers.disruptions.length - 1;
            i <= ref;
            i++
          ) {
            const feature = vt.layers.disruptions.feature(i);
            const geometryList = feature.loadGeometry();

            if (
              feature.properties.type === 'TrafficDisorder' ||
              feature.properties.type === 'TrafficAnnouncement'
            ) {
              this.fetchItem(geometryList, feature);
            }
          }
        }
      });

  fetchItem = (geometryList, feature) => {
    const { id } = feature.properties;
    const query =
      feature.properties.type === 'TrafficAnnouncement'
        ? Relay.createQuery(
            Relay.QL`
              query ($id: String!){
                trafficAnnouncement(id: $id) {
                  severity
                  status
                  startTime
                  endTime
                  modesOfTransport
                  class {
                    class
                  }
                }
              }`,
            { id },
          )
        : Relay.createQuery(
            Relay.QL`
              query ($id: String!){
                trafficDisorder(id: $id) {
                  severity
                  status
                  startTime
                  endTime
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
          let draw =
            result.status === 'ACTIVE' ||
            moment().isBefore(result.endTime) ||
            !result.endTime;

          if (feature.properties.type === 'TrafficAnnouncement') {
            const streetMode = getStreetMode(null, this.config);
            draw =
              draw &&
              result.modesOfTransport.includes(
                streetMode === 'WALK' ? 'PEDESTRIAN' : streetMode,
              );
          }

          if (draw) {
            this.drawItem(geometryList, feature, result);
          }
        }
      }
      return this;
    };

    if (lastFetch && currentTime - lastFetch <= 300000) {
      Relay.Store.primeCache({ query }, callback);
    } else {
      Relay.Store.forceFetch({ query }, callback);
    }
  };

  drawItem = (geometryList, feature, result) => {
    const currentConfig =
      feature.properties.type === 'TrafficAnnouncement'
        ? this.config.trafficAnnouncements
        : this.config.disorders;

    const geojson = feature.toGeoJSON(
      this.tile.coords.x,
      this.tile.coords.y,
      this.tile.coords.z,
    );

    const type = get(geojson, 'geometry.type');
    const isAccident = get(result, 'class', []).filter(
      item => item.class === 'ACC',
    ).length;
    const isDetour = get(feature, 'properties.detour', false);

    // Default color according to severity, changes if detour or accident
    let color = get(currentConfig, `colors.${result.severity}`);

    if (moment().isBefore(result.startTime) && currentConfig.showUpcoming) {
      color = get(currentConfig, 'colors.UPCOMING') || color;
      if (isDetour && !currentConfig.showUpcomingDetour) {
        return;
      }
    } else if (isDetour) {
      if (!currentConfig.showDetours) {
        return;
      }
      color = get(currentConfig, 'colors.DETOUR') || color;
    } else if (isAccident) {
      color = isAccident ? get(currentConfig, 'colors.ACCIDENT') : color;
    }

    const geomColor = get(currentConfig, 'colors.GEOM_OVERRIDE', color);

    geometryList.forEach(geom => {
      this.drawGeom(feature, geom, type, currentConfig, color, geomColor);
    });
  };

  drawGeom = (feature, geom, type, currentConfig, color, geomColor) => {
    if (type === 'LineString') {
      if (currentConfig.showLines) {
        drawDisorderPath(this.tile, geom, geomColor);
        this.features.push({
          lineString: geom,
          geom: null,
          properties: feature.properties,
        });
      }

      if (currentConfig && currentConfig.showLineIcons) {
        const iconPoints = currentConfig.showLines
          ? [geom[0], geom.slice(-1)[0]]
          : geom;
        iconPoints.forEach(point => {
          if (
            point &&
            point.x > 0 &&
            point.y > 0 &&
            point.x < feature.extent &&
            point.y < feature.extent
          ) {
            drawDisorderIcon(this.tile, point, this.imageSize, color);
            if (!currentConfig.showLines) {
              this.features.push({
                geom: point,
                properties: feature.properties,
              });
            }
          }
        });
      }
    } else if (type === 'Polygon') {
      if (currentConfig.showPolygons) {
        drawDisorderPolygon(this.tile, geom, geomColor);
        this.features.push({
          polygon: geom,
          geom: null,
          properties: feature.properties,
        });
      }

      if (currentConfig && currentConfig.showPolygonCenterIcon) {
        const formatedPolygon = geom.map(cords => [cords.x, cords.y]);
        const centerPoint = get(
          centerOfMass(turfPolygon([formatedPolygon])),
          'geometry.coordinates',
          [],
        );

        if (centerPoint.length) {
          const centerPointFormated = {
            x: centerPoint[0],
            y: centerPoint[1],
          };

          drawDisorderIcon(
            this.tile,
            centerPointFormated,
            this.imageSize,
            color,
          );
          if (!currentConfig.showPolygons) {
            this.features.push({
              geom: centerPointFormated,
              properties: feature.properties,
            });
          }
        }
      }
    } else if (type === 'Point' && currentConfig.showIcons) {
      drawDisorderIcon(this.tile, geom[0], this.imageSize, color);
      this.features.push({
        geom: geom[0],
        properties: feature.properties,
      });
    }
  };
}
