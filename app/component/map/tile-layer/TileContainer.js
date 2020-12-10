import flatten from 'lodash/flatten';
import omit from 'lodash/omit';
import L from 'leaflet';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {
  point as turfPoint,
  polygon as turfPolygon,
  lineString as turfLineString,
} from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';

import { isBrowser } from '../../../util/browser';
import { isLayerEnabled } from '../../../util/mapLayerUtils';

class TileContainer {
  constructor(coords, done, props, config, location, map) {
    const markersMinZoom = Math.min(
      config.cityBike.cityBikeMinZoom,
      config.stopsMinZoom,
      config.terminalStopsMinZoom,
      config.parkAndRide.parkAndRideMinZoom,
      config.ticketSales.ticketSalesMinZoom,
      config.parkingStations.parkingStationsMinZoom,
      config.roadworks.roadworksMinZoom,
      config.disorders.disordersMinZoom,
      config.cameraStations.cameraStationsMinZoom,
      config.weatherStations.weatherStationsMinZoom,
      config.tmsStations.tmsStationsMinZoom,
      config.roadConditions.roadConditionsMinZoom,
      config.fluencies.fluenciesMinZoom,
      config.ecoCounters.ecoCounterMinZoom,
      config.maintenanceVehicles.maintenanceVehiclesMinZoom,
      config.bicycleRoutes.bicycleRoutesMinZoon,
    );

    this.coords = coords;
    this.props = props;
    this.extent = 4096;
    this.scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.tileSize = (this.props.tileSize || 256) * this.scaleratio;
    this.ratio = this.extent / this.tileSize;
    this.el = this.createElement();
    this.clickCount = 0;
    this.map = map;

    if (this.coords.z < markersMinZoom || !this.el.getContext) {
      setTimeout(() => done(null, this.el), 0);
      return;
    }

    this.ctx = this.el.getContext('2d');

    this.layers = this.props.layers
      .filter(Layer => {
        const layerName = Layer.getName();
        const isEnabled = isLayerEnabled(layerName, this.props.mapLayers);

        if (
          layerName === 'stop' &&
          (this.coords.z >= config.stopsMinZoom ||
            this.coords.z >= config.terminalStopsMinZoom)
        ) {
          return isEnabled;
        } else if (
          layerName === 'citybike' &&
          this.coords.z >= config.cityBike.cityBikeMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'parkAndRide' &&
          this.coords.z >= config.parkAndRide.parkAndRideMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'ticketSales' &&
          this.coords.z >= config.ticketSales.ticketSalesMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'parkingStations' &&
          this.coords.z >= config.parkingStations.parkingStationsMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'roadworks' &&
          this.coords.z >= config.roadworks.roadworksMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'disorders' &&
          this.coords.z >= config.disorders.disordersMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'cameraStations' &&
          this.coords.z >= config.cameraStations.cameraStationsMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'weatherStations' &&
          this.coords.z >= config.weatherStations.weatherStationsMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'tmsStations' &&
          this.coords.z >= config.tmsStations.tmsStationsMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'roadConditions' &&
          this.coords.z >= config.roadConditions.roadConditionsMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'maintenanceVehicles' &&
          this.coords.z >= config.maintenanceVehicles.maintenanceVehiclesMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'realtimeMaintenanceVehicles' &&
          this.coords.z >= config.maintenanceVehicles.maintenanceVehiclesMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'roadInspectionVehicles' &&
          this.coords.z >=
            config.roadInspectionVehicles.roadInspectionVehiclesMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'fluencies' &&
          this.coords.z >= config.fluencies.fluenciesMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'ecoCounters' &&
          this.coords.z >= config.ecoCounters.ecoCounterMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'roadSigns' &&
          this.coords.z >= config.roadSigns.roadSignsMinZoom
        ) {
          return isEnabled;
        } else if (
          layerName === 'bicycleRoutesMainRegional' &&
          this.coords.z >= config.bicycleRoutes.bicycleRoutesMinZoom
        ) {
          return (
            isEnabled && isLayerEnabled('bicycleRoutes', this.props.mapLayers)
          );
        } else if (
          layerName === 'bicycleRouteTypes' &&
          this.coords.z >= config.bicycleRoutes.bicycleRoutesMinZoom
        ) {
          return (
            isEnabled && isLayerEnabled('bicycleRoutes', this.props.mapLayers)
          );
        } else if (
          layerName === 'bicycleRoutesBaana' &&
          this.coords.z >= config.bicycleRoutes.bicycleRoutesMinZoom
        ) {
          return (
            isEnabled && isLayerEnabled('bicycleRoutes', this.props.mapLayers)
          );
        } else if (
          layerName === 'bicycleRoutesBrand' &&
          this.coords.z >= config.bicycleRoutes.bicycleRoutesMinZoom
        ) {
          return (
            isEnabled && isLayerEnabled('bicycleRoutes', this.props.mapLayers)
          );
        }
        return false;
      })
      .map(
        Layer =>
          new Layer(
            this,
            config,
            this.props.mapLayers,
            this.props.mapLayerOptions,
            location,
          ),
      );

    this.el.layers = this.layers.map(layer => omit(layer, 'tile'));

    Promise.all(this.layers.map(layer => layer.promise)).then(() =>
      done(null, this.el),
    );
  }

  project = point => {
    const size =
      this.extent * 2 ** (this.coords.z + (this.props.zoomOffset || 0));
    const x0 = this.extent * this.coords.x;
    const y0 = this.extent * this.coords.y;
    const y1 = 180 - (point.y + y0) * 360 / size;
    return {
      lon: (point.x + x0) * 360 / size - 180,
      lat: 360 / Math.PI * Math.atan(Math.exp(y1 * (Math.PI / 180))) - 90,
    };
  };

  createElement = () => {
    const el = document.createElement('canvas');
    el.setAttribute('class', 'leaflet-tile');
    el.setAttribute('height', this.tileSize);
    el.setAttribute('width', this.tileSize);
    el.onMapClick = this.onMapClick;
    return el;
  };

  onMapClick = (e, point) => {
    let nearest;
    let features;
    let localPoint;

    if (this.layers) {
      localPoint = [
        (point[0] * this.scaleratio) % this.tileSize,
        (point[1] * this.scaleratio) % this.tileSize,
      ];
      features = flatten(
        this.layers.map(
          layer =>
            layer.features &&
            layer.features.map(feature => ({
              layer: layer.constructor.getName(),
              feature,
              map: layer.tile.map,
            })),
        ),
      );

      nearest = features
        .map(feature => {
          if (!feature) {
            return null;
          }

          // Polygon check
          if (feature.feature.polygon) {
            const currentFeature = { ...feature };
            const { polygon } = currentFeature.feature;

            const formatedPolygon = polygon.map(cords => [
              cords.x / this.ratio,
              cords.y / this.ratio,
            ]);

            const pointWithinDist = booleanPointInPolygon(
              turfPoint(localPoint),
              turfPolygon([formatedPolygon]),
            );

            if (pointWithinDist) {
              currentFeature.feature.geom = {
                x: localPoint[0] * this.ratio,
                y: localPoint[1] * this.ratio,
              };
              return currentFeature;
            }

            return null;
          }

          // LineString check
          if (feature.feature.lineString) {
            const currentFeature = { ...feature };
            const { lineString } = currentFeature.feature;

            // convert coordinates to lon/lat for nearest point calculation
            const lonLatLineString = lineString.map(cords => {
              const { lon, lat } = this.project(cords);
              return [lon, lat];
            });

            // get the nearest point in the line measured from the click event
            const nearestPointOnLineTurf = nearestPointOnLine(
              turfLineString(lonLatLineString),
              turfPoint([e.latlng.lng, e.latlng.lat]),
            );

            // get maplayerpoint for the click
            const clickPoint = feature.map.latLngToLayerPoint(
              L.latLng(e.latlng.lat, e.latlng.lng),
            );

            // get maplayerpoint for the closest point in the line
            const linePoint = feature.map.latLngToLayerPoint(
              L.latLng(
                nearestPointOnLineTurf.geometry.coordinates[1],
                nearestPointOnLineTurf.geometry.coordinates[0],
              ),
            );

            // get the cartesian distance between the two points
            const screenDistance = clickPoint.distanceTo(linePoint);

            if (screenDistance < 20 * this.scaleratio) {
              currentFeature.feature.dist = screenDistance;
              currentFeature.feature.geom = {
                x: localPoint[0] * this.ratio,
                y: localPoint[1] * this.ratio,
              };
              return currentFeature;
            }

            return null;
          }

          const g = feature.feature.geom;
          const dist = Math.sqrt(
            (localPoint[0] - g.x / this.ratio) ** 2 +
              (localPoint[1] - g.y / this.ratio) ** 2,
          );

          if (dist < 22 * this.scaleratio) {
            return feature;
          }
          return null;
        })
        .map(feature => {
          if (feature) {
            // map is no longer needed
            const { map, ...featuresWithoutMap } = feature;
            return featuresWithoutMap;
          }
          return feature;
        })
        .filter(item => item !== null);

      if (e.type === 'click') {
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.timer = null;

            if (nearest.length === 0) {
              return this.onSelectableTargetClicked([], e.latlng);
            } else if (nearest.length === 1) {
              L.DomEvent.stopPropagation(e);
              // open menu for single stop
              const latLon = L.latLng(this.project(nearest[0].feature.geom));
              return this.onSelectableTargetClicked(nearest, latLon);
            }
            L.DomEvent.stopPropagation(e);
            return this.onSelectableTargetClicked(nearest, e.latlng); // open menu for a list of stops
          }, 300);
        } else {
          clearTimeout(this.timer);
          this.timer = null;
        }
        return false;
      } else if (e.type === 'contextmenu') {
        // no need to check double clicks
        if (nearest.length === 0) {
          return this.onSelectableTargetClicked([], e.latlng);
        }
      }

      L.DomEvent.stopPropagation(e);
      return this.onSelectableTargetClicked(nearest, e.latlng); // open menu for a list of stops
    }
    return false;
  };
}

export default TileContainer;
