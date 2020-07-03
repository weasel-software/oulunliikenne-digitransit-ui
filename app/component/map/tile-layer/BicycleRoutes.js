import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import sortBy from 'lodash/sortBy';
import { drawBicycleRoutePath } from '../../../util/mapIconUtils';
import { isBrowser } from '../../../util/browser';
import { BicycleRouteLines } from '../../../constants';

class BicycleRoutes {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;
    const scaleRatio = (isBrowser && window.devicePixelRatio) || 1;
    this.imageSize = 20 * scaleRatio;
    this.mapURL = this.config.URL.BICYCLE_ROUTES_BRAND_MAP;
    this.layerKey = 'bicycleroutes';
    this.typePrefix = '';
  }

  static getName = () => 'bicycleRoutes';

  getPromise = () => {
    fetch(
      `${this.mapURL}${this.tile.coords.z +
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

        if (vt.layers[this.layerKey] != null) {
          const tileLayerFeatures = [];
          for (
            let j = 0, ll = vt.layers[this.layerKey].length - 1;
            j <= ll;
            j++
          ) {
            const feature = vt.layers[this.layerKey].feature(j);
            tileLayerFeatures.push(feature);
          }

          // Sort by type
          const sortedFeatures = sortBy(tileLayerFeatures, 'properties.type');

          // Draw the features onto the map.
          for (let i = 0, ref = sortedFeatures.length - 1; i <= ref; i++) {
            const feature = sortedFeatures[i];
            const geometryList = feature.loadGeometry();
            const lineConfig =
              BicycleRouteLines[
                `${this.typePrefix}-${feature.properties.type}`
              ];

            if (lineConfig) {
              geometryList.forEach(geom => {
                if (
                  this.config.bicycleRoutes &&
                  this.config.bicycleRoutes.showLines &&
                  geom.length > 1
                ) {
                  drawBicycleRoutePath(
                    this.tile,
                    geom,
                    lineConfig.color,
                    lineConfig.dashed,
                  );
                  this.features.push({
                    lineString: geom,
                    geom: null,
                    properties: feature.properties,
                  });
                }
              });
            }
          }
        }
      });
  };
}

export class BicycleRoutesBaana extends BicycleRoutes {
  constructor(tile, config) {
    super(tile, config);
    this.mapURL = this.config.URL.BICYCLE_ROUTES_BAANA_MAP;
    this.layerKey = 'bicycleroutesbaana';
    this.typePrefix = 'BAANA';
    this.promise = this.getPromise();
  }
  static getName = () => 'bicycleRoutesBaana';
}

export class BicycleRoutesBrand extends BicycleRoutes {
  constructor(tile, config) {
    super(tile, config);
    this.mapURL = this.config.URL.BICYCLE_ROUTES_BRAND_MAP;
    this.layerKey = 'bicycleroutesbrand';
    this.typePrefix = 'BRAND';
    this.promise = this.getPromise();
  }
  static getName = () => 'bicycleRoutesBrand';
}

export class BicycleRoutesMainRegional extends BicycleRoutes {
  constructor(tile, config) {
    super(tile, config);
    this.mapURL = this.config.URL.BICYCLE_ROUTES_MAIN_REGIONAL_MAP;
    this.layerKey = 'bicycleroutesmainregional';
    this.typePrefix = 'MAIN_REGIONAL';
    this.promise = this.getPromise();
  }
  static getName = () => 'bicycleRoutesMainRegional';
}

export class BicycleRouteTypes extends BicycleRoutes {
  constructor(tile, config) {
    super(tile, config);
    this.mapURL = this.config.URL.BICYCLE_ROUTE_TYPES_MAP;
    this.layerKey = 'bicycleroutetypes';
    this.typePrefix = 'TYPES';
    this.promise = this.getPromise();
  }
  static getName = () => 'bicycleRouteTypes';
}
