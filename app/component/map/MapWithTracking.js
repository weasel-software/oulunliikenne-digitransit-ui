import PropTypes from 'prop-types';
import React from 'react';
import { locationShape } from 'react-router';
import connectToStores from 'fluxible-addons-react/connectToStores';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import getContext from 'recompose/getContext';
import LazilyLoad, { importLazy } from '../LazilyLoad';
import ComponentUsageExample from '../ComponentUsageExample';
import MapContainer from './MapContainer';
import ToggleMapTracking from '../ToggleMapTracking';
import { dtLocationShape } from '../../util/shapes';
import withBreakpoint from '../../util/withBreakpoint';
import VehicleMarkerContainer from '../map/VehicleMarkerContainer';
import MaintenanceVehicleMarkerContainer from '../map/MaintenanceVehicleMarkerContainer';
import {
  startRealTimeClient,
  stopRealTimeClient,
  updateTopic,
} from '../../action/realTimeClientAction';
import {
  startRealTimeClient as altStartRealTimeClient,
  stopRealTimeClient as altStopRealTimeClient,
  updateTopic as altUpdateTopic,
} from '../../action/altRealTimeClientAction';
import {
  startRealTimeClient as maintenanceVehicleStartRealTimeClient,
  stopRealTimeClient as maintenanceVehicleStopRealTimeClient,
  updateTopic as maintenanceVehicleUpdateTopic,
  ROUTE_TYPE_MOTORISED_TRAFFIC,
  ROUTE_TYPE_NON_MOTORISED_TRAFFIC,
} from '../../action/maintenanceVehicleRealTimeClientAction';
import { clearDepartures } from '../../action/RealtimeDeparturesActions';
import { getStreetMode } from '../../util/modeUtils';
import { StreetMode } from '../../constants';

const DEFAULT_ZOOM = 12;
const FOCUS_ZOOM = 16;

const onlyUpdateCoordChanges = onlyUpdateForKeys([
  'lat',
  'lon',
  'zoom',
  'mapTracking',
  'showStops',
  'showScaleBar',
  'origin',
  'children',
]);

const placeMarkerModules = {
  PlaceMarker: () =>
    importLazy(import(/* webpackChunkName: "map" */ './PlaceMarker')),
};

const Component = onlyUpdateCoordChanges(MapContainer);

class MapWithTrackingStateHandler extends React.Component {
  static propTypes = {
    origin: dtLocationShape.isRequired,
    position: PropTypes.shape({
      hasLocation: PropTypes.bool.isRequired,
      isLocationingInProgress: PropTypes.bool.isRequired,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
    }).isRequired,
    config: PropTypes.shape({
      defaultMapZoom: PropTypes.number,
      defaultMapCenter: dtLocationShape,
      defaultEndpoint: dtLocationShape.isRequired,
    }).isRequired,
    children: PropTypes.array,
    renderCustomButtons: PropTypes.func,
    breakpoint: PropTypes.string.isRequired,
    mapLayers: PropTypes.object,
  };

  static defaultProps = {
    renderCustomButtons: undefined,
  };

  constructor(props) {
    super(props);
    const hasOriginorPosition =
      props.origin.ready || props.position.hasLocation;
    this.state = {
      defaultZoom: props.config.defaultMapZoom || DEFAULT_ZOOM,
      initialZoom: hasOriginorPosition
        ? FOCUS_ZOOM
        : props.config.defaultMapZoom || DEFAULT_ZOOM,
      mapTracking: props.origin.gps && props.position.hasLocation,
      focusOnOrigin: props.origin.ready,
      origin: props.origin,
      shouldShowDefaultLocation: !hasOriginorPosition,
    };
  }

  componentDidMount() {
    const { mapLayers, location, config } = this.props;

    if (
      mapLayers.maintenanceVehicles &&
      mapLayers.realtimeMaintenanceVehicles
    ) {
      const mode = getStreetMode(location, config);
      this.setMaintenanceRealtimeClient(true, mode);
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      // "current position selected"
      newProps.origin.lat != null &&
      newProps.origin.lon != null &&
      newProps.origin.gps === true &&
      ((this.state.origin.ready === false && newProps.origin.ready === true) ||
        !this.state.origin.gps) // current position selected
    ) {
      this.usePosition(newProps.origin);
    } else if (
      // "poi selected"
      !newProps.origin.gps &&
      (newProps.origin.lat !== this.state.origin.lat ||
        newProps.origin.lon !== this.state.origin.lon) &&
      newProps.origin.lat != null &&
      newProps.origin.lon != null
    ) {
      this.useOrigin(newProps.origin);
    }

    if (newProps.realtimeDepartures !== this.props.realtimeDepartures) {
      this.setRealtimeClient(newProps.realtimeDepartures);
    }

    const mode = getStreetMode(this.props.location, this.props.config);
    const newMode = getStreetMode(newProps.location, newProps.config);
    if (
      newProps.mapLayers.maintenanceVehicles !==
        this.props.mapLayers.maintenanceVehicles ||
      newProps.mapLayers.realtimeMaintenanceVehicles !==
        this.props.mapLayers.realtimeMaintenanceVehicles ||
      newMode !== mode
    ) {
      this.setMaintenanceRealtimeClient(
        newProps.mapLayers.maintenanceVehicles &&
          newProps.mapLayers.realtimeMaintenanceVehicles,
        newMode,
      );
    }
  }

  componentWillUnmount() {
    this.props.executeAction(clearDepartures);

    const { client } = this.props.getStore('RealTimeInformationStore');
    if (client) {
      this.props.executeAction(
        this.props.config.useAltRealtimeClient
          ? stopRealTimeClient
          : altStopRealTimeClient,
        client,
      );
    }

    this.setMaintenanceRealtimeClient(false);
  }

  setRealtimeClient = departures => {
    const { client, subscriptions } = this.props.getStore(
      'RealTimeInformationStore',
    );

    if (Array.isArray(departures) && departures.length) {
      if (client) {
        this.props.executeAction(
          this.props.config.useAltRealtimeClient ? altUpdateTopic : updateTopic,
          {
            client,
            oldTopics: subscriptions,
            newTopic: departures.map(departure => ({
              route: departure.pattern.route.gtfsId.split(':')[1],
            })),
          },
        );
      } else {
        this.props.executeAction(
          this.props.config.useAltRealtimeClient
            ? altStartRealTimeClient
            : startRealTimeClient,
          departures.map(departure => ({
            route: departure.pattern.route.gtfsId.split(':')[1],
          })),
        );
      }
    } else if (client) {
      this.props.executeAction(
        this.props.config.useAltRealtimeClient
          ? stopRealTimeClient
          : altStopRealTimeClient,
        client,
      );
    }
  };

  setMaintenanceRealtimeClient = (isLayerEnabled, mode) => {
    const { client, subscriptions } = this.props.getStore(
      'MaintenanceVehicleRealTimeInformationStore',
    );

    const routeType =
      mode === StreetMode.CAR
        ? ROUTE_TYPE_MOTORISED_TRAFFIC
        : ROUTE_TYPE_NON_MOTORISED_TRAFFIC;

    if (isLayerEnabled) {
      if (client) {
        this.props.executeAction(maintenanceVehicleUpdateTopic, {
          client,
          oldTopics: subscriptions,
          newTopic: routeType,
        });
      } else {
        this.props.executeAction(
          maintenanceVehicleStartRealTimeClient,
          routeType,
        );
      }
    } else {
      this.props.executeAction(maintenanceVehicleStopRealTimeClient, client);
    }
  };

  usePosition(origin) {
    this.setState({
      origin,
      mapTracking: true,
      focusOnOrigin: false,
      initialZoom:
        this.state.initialZoom === this.state.defaultZoom
          ? FOCUS_ZOOM
          : undefined,
      shouldShowDefaultLocation: false,
    });
  }

  useOrigin(origin) {
    this.setState({
      origin,
      mapTracking: false,
      focusOnOrigin: true,
      initialZoom:
        this.state.initialZoom === this.state.defaultZoom
          ? FOCUS_ZOOM
          : undefined,
      shouldShowDefaultLocation: false,
    });
  }

  enableMapTracking = () => {
    this.setState({
      mapTracking: true,
      focusOnOrigin: false,
    });
  };

  disableMapTracking = () => {
    this.setState({
      mapTracking: false,
      focusOnOrigin: false,
    });
  };

  render() {
    const {
      position,
      origin,
      config,
      children,
      renderCustomButtons,
      breakpoint,
      realtimeDepartures,
      mapLayers,
      ...rest
    } = this.props;
    let location;

    if (
      this.state.focusOnOrigin &&
      !this.state.origin.gps &&
      this.state.origin.lat != null &&
      this.state.origin.lon != null
    ) {
      location = this.state.origin;
    } else if (this.state.mapTracking && position.hasLocation) {
      location = position;
    } else if (this.state.shouldShowDefaultLocation) {
      location = config.defaultMapCenter || config.defaultEndpoint;
    }

    const leafletObjs = [];

    if (origin && origin.ready === true && origin.gps !== true) {
      leafletObjs.push(
        <LazilyLoad modules={placeMarkerModules} key="from">
          {({ PlaceMarker }) => <PlaceMarker position={this.props.origin} />}
        </LazilyLoad>,
      );
    }

    if (realtimeDepartures) {
      leafletObjs.push(
        <VehicleMarkerContainer
          key="vehicleMarkers"
          departures={realtimeDepartures.map(departure => ({
            pattern: departure.pattern,
            shortName: departure.pattern.route.shortName,
          }))}
          className="vehicle-realtime-icon"
        />,
      );
    }

    if (
      mapLayers.maintenanceVehicles &&
      mapLayers.realtimeMaintenanceVehicles
    ) {
      leafletObjs.push(
        <MaintenanceVehicleMarkerContainer
          key="maintenanceVehicleMarkers"
          className="maintenance-vehicle-realtime-icon"
        />,
      );
    }

    return (
      <Component
        lat={location ? location.lat : null}
        lon={location ? location.lon : null}
        zoom={this.state.initialZoom}
        mapTracking={this.state.mapTracking}
        className="flex-grow"
        origin={this.props.origin}
        leafletEvents={{
          onDragstart: this.disableMapTracking,
          onZoomend: null, // this.disableMapTracking,
        }}
        disableMapTracking={this.disableMapTracking}
        {...rest}
        leafletObjs={leafletObjs}
      >
        {children}
        {(!config.mapTrackingButtons ||
          (breakpoint !== 'large' &&
            !config.mapTrackingButtons.altPositionMobile) ||
          !config.mapTrackingButtons.altPosition) && (
          <div className="map-with-tracking-buttons">
            {renderCustomButtons && renderCustomButtons()}
            {this.props.position.hasLocation && (
              <ToggleMapTracking
                key="toggleMapTracking"
                handleClick={
                  this.state.mapTracking
                    ? this.disableMapTracking
                    : this.enableMapTracking
                }
                className={`icon-mapMarker-toggle-positioning-${
                  this.state.mapTracking ? 'online' : 'offline'
                }`}
              />
            )}
          </div>
        )}
      </Component>
    );
  }
}

// todo convert to use origin prop
const MapWithTracking = connectToStores(
  getContext({
    config: PropTypes.shape({
      defaultMapCenter: dtLocationShape,
    }),
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
  })(MapWithTrackingStateHandler),
  ['PositionStore', 'RealtimeDeparturesStore', 'MapLayerStore'],
  ({ getStore, location }) => ({
    location,
    position: getStore('PositionStore').getLocationState(),
    realtimeDepartures: getStore('RealtimeDeparturesStore').getDepartures(),
    mapLayers: getStore('MapLayerStore').getMapLayers(),
  }),
  {
    location: locationShape,
  },
);

MapWithTracking.description = (
  <div>
    <p>Renders a map with map-tracking functionality</p>
    <ComponentUsageExample description="">
      <MapWithTracking />
    </ComponentUsageExample>
  </div>
);

export default withBreakpoint(MapWithTracking);
