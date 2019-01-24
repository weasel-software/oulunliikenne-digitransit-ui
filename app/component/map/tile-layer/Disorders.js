import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import get from 'lodash/get';
import centerOfMass from '@turf/center-of-mass';
import turfPolygon from 'turf-polygon';

import {
  drawDisorderIcon,
  drawDisorderPath,
  drawDisorderPolygon,
} from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';

export default class Disorders {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleratio;
    this.promise = this.getPromise();
  }

  static getName = () => 'disorders';

  getPromise() {
    return fetch(
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

              geometryList.forEach(geom => {
                if (type === 'LineString') {
                  drawDisorderPath(this.tile, geom);
                  this.features.push({
                    lineString: geom,
                    geom: null,
                    properties: feature.properties,
                  });

                  if (currentConfig && currentConfig.showLineIcons) {
                    const iconPoints = [geom[0], geom.slice(-1)[0]];
                    iconPoints.forEach(point => {
                      if (
                        point &&
                        point.x > 0 &&
                        point.y > 0 &&
                        point.x < feature.extent &&
                        point.y < feature.extent
                      ) {
                        drawDisorderIcon(this.tile, point, this.imageSize);
                      }
                    });
                  }
                } else if (type === 'Polygon') {
                  drawDisorderPolygon(this.tile, geom);
                  this.features.push({
                    polygon: geom,
                    geom: null,
                    properties: feature.properties,
                  });

                  if (currentConfig && currentConfig.showPolygonCenterIcon) {
                    const formatedPolygon = geom.map(cords => [
                      cords.x,
                      cords.y,
                    ]);
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
                      );
                    }
                  }
                } else if (type === 'Point') {
                  drawDisorderIcon(this.tile, geom[0], this.imageSize);
                  this.features.push({
                    geom: geom[0],
                    properties: feature.properties,
                  });
                }
              });
            }
          }
        }
      });
  }
}
