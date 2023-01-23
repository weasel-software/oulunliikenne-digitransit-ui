import connectToStores from 'fluxible-addons-react/connectToStores';
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { locationShape } from 'react-router';
import { intlShape } from 'react-intl';
import GridLayer from 'react-leaflet/es/GridLayer';
import SphericalMercator from '@mapbox/sphericalmercator';
import lodashFilter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import L from 'leaflet';

import Popup from '../Popup';
import StopRoute from '../../../route/StopRoute';
import TerminalRoute from '../../../route/TerminalRoute';
import CityBikeRoute from '../../../route/CityBikeRoute';
import ParkingStationRoute from '../../../route/ParkingStationRoute';
import CameraStationRoute from '../../../route/CameraStationRoute';
import RoadworkRoute from '../../../route/RoadworkRoute';
import DisorderRoute from '../../../route/DisorderRoute';
import TrafficAnnouncementRoute from '../../../route/TrafficAnnouncementRoute';
import WeatherStationRoute from '../../../route/WeatherStationRoute';
import TmsStationRoute from '../../../route/TmsStationRoute';
import RoadConditionRoute from '../../../route/RoadConditionRoute';
import MaintenanceVehicleRouteRoute from '../../../route/MaintenanceVehicleRouteRoute';
import StopMarkerPopup from '../popups/StopMarkerPopup';
import MarkerSelectPopup from './MarkerSelectPopup';
import CityBikePopup from '../popups/CityBikePopup';
import WeatherStationPopup from '../popups/WeatherStationPopup';
import TmsStationPopup from '../popups/TmsStationPopup';
import ParkingStationPopup from '../popups/ParkingStationPopup';
import ParkAndRideHubPopup from '../popups/ParkAndRideHubPopup';
import ParkAndRideFacilityPopup from '../popups/ParkAndRideFacilityPopup';
import ParkAndRideHubRoute from '../../../route/ParkAndRideHubRoute';
import ParkAndRideFacilityRoute from '../../../route/ParkAndRideFacilityRoute';
import TicketSalesPopup from '../popups/TicketSalesPopup';
import FluencyPopup from '../popups/FluencyPopup';
import CameraStationPopup from '../popups/CameraStationPopup';
import RoadworkPopup from '../popups/RoadworkPopup';
import DisorderPopup from '../popups/DisorderPopup';
import TrafficAnnouncementPopup from '../popups/TrafficAnnouncementPopup';
import RoadConditionPopup from '../popups/RoadConditionPopup';
import MaintenanceVehicleRoutePopup from '../popups/MaintenanceVehicleRoutePopup';
import LocationPopup from '../popups/LocationPopup';
import TileContainer from './TileContainer';
import Loading from '../../Loading';
import { isFeatureLayerEnabled } from '../../../util/mapLayerUtils';
import MapLayerStore, { mapLayerShape } from '../../../store/MapLayerStore';
import MapLayerOptionsStore, {
  mapLayerOptionsShape,
} from '../../../store/MapLayerOptionsStore';
import MaintenanceVehicleTailStore, {
  maintenanceVehicleTailShape,
} from '../../../store/MaintenanceVehicleTailStore';
import EcoCounterPopup from '../popups/EcoCounterPopup';
import RoadSignPopup from '../popups/RoadSignPopup';
import RoadSignRoute from '../../../route/RoadSignRoute';
import BicycleRoutePopup from '../popups/BicycleRoutePopup';
import CityWeatherStationRoute from '../../../route/CityWeatherStationRoute';
import CityWeatherStationPopup from '../popups/CityWeatherStationPopup';

const initialState = {
  selectableTargets: undefined,
  coords: undefined,
  showSpinner: true,
};

// TODO eslint doesn't know that TileLayerContainer is a react component,
//      because it doesn't inherit it directly. This will force the detection
/** @extends React.Component */
class TileLayerContainer extends GridLayer {
  static propTypes = {
    tileSize: PropTypes.number.isRequired,
    zoomOffset: PropTypes.number.isRequired,
    disableMapTracking: PropTypes.func,
    mapLayers: mapLayerShape.isRequired,
    mapLayerOptions: mapLayerOptionsShape.isRequired,
    highlightedStop: PropTypes.string,
    highlightedFluency: PropTypes.string,
    maintenanceVehicleTail: maintenanceVehicleTailShape.isRequired,
  };

  static defaultProps = {
    highlightedStop: null,
    highlightedFluency: null,
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    map: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    location: locationShape.isRequired,
  };

  state = {
    ...initialState,
    currentTime: this.context
      .getStore('TimeStore')
      .getCurrentTime()
      .unix(),
  };

  componentWillMount() {
    super.componentWillMount();
    this.context.getStore('TimeStore').addChangeListener(this.onTimeChange);
  }

  componentDidUpdate(prevProps) {
    if (this.context.popupContainer != null) {
      this.context.popupContainer.openPopup();
    }

    if (
      !isEqual(prevProps.mapLayers, this.props.mapLayers) ||
      !isEqual(prevProps.mapLayerOptions, this.props.mapLayerOptions) ||
      !isEqual(prevProps.hilightedStops, this.props.hilightedStops) ||
      !isEqual(
        prevProps.maintenanceVehicleTail,
        this.props.maintenanceVehicleTail,
      )
    ) {
      this.context.map.removeEventParent(this.leafletElement);
      this.leafletElement.remove();
      this.leafletElement = this.createLeafletElement(this.props);
      this.context.map.addLayer(this.leafletElement);

      if (this.leafletElementHighlighted) {
        this.leafletElementHighlighted.remove();
      }
    }

    if (
      !isEqual(prevProps.highlightedStop, this.props.highlightedStop) ||
      !isEqual(prevProps.highlightedFluency, this.props.highlightedFluency)
    ) {
      if (this.leafletElementHighlighted) {
        this.leafletElementHighlighted.remove();
      }

      if (this.props.highlightedStop || this.props.highlightedFluency) {
        this.leafletElementHighlighted = this.createLeafletElement(
          this.props,
          false,
        );
        this.context.map.addLayer(this.leafletElementHighlighted);
      }
    }
  }

  componentWillUnmount() {
    this.context.getStore('TimeStore').removeChangeListener(this.onTimeChange);
    this.leafletElement.off('click contextmenu', this.onClick);
  }

  onTimeChange = e => {
    let activeTiles;

    if (e.currentTime) {
      this.setState({ currentTime: e.currentTime.unix(), showSpinner: false });

      /* eslint-disable no-underscore-dangle */
      activeTiles = lodashFilter(
        this.leafletElement._tiles,
        tile => tile.active,
      );
      /* eslint-enable no-underscore-dangle */
      activeTiles.forEach(
        tile =>
          tile.el.layers &&
          tile.el.layers.forEach(layer => {
            if (layer.onTimeChange) {
              layer.onTimeChange();
            }
          }),
      );
    }
  };

  onClick = e => {
    /* eslint-disable no-underscore-dangle */
    Object.keys(this.leafletElement._tiles)
      .filter(key => this.leafletElement._tiles[key].active)
      .filter(key => this.leafletElement._keyToBounds(key).contains(e.latlng))
      .forEach(key =>
        this.leafletElement._tiles[key].el.onMapClick(
          e,
          this.merc.px(
            [e.latlng.lng, e.latlng.lat],
            Number(key.split(':')[2]) + this.props.zoomOffset,
          ),
        ),
      );
    /* eslint-enable no-underscore-dangle */
  };

  onPopupclose = () => this.setState(initialState);

  PopupOptions = {
    offset: [110, 16],
    minWidth: 320,
    maxWidth: 320,
    autoPanPaddingTopLeft: [5, 125],
    className: 'popup',
    ref: 'popup',
    onClose: this.onPopupclose,
    autoPan: false,
  };

  createLeafletElement(props, withEventParent = true) {
    const Layer = L.GridLayer.extend({
      createTile: withEventParent ? this.createTile : this.createTileAlt,
    });
    const leafletElement = new Layer(this.getOptions(props));

    if (withEventParent) {
      this.context.map.addEventParent(leafletElement);
      leafletElement.on('click contextmenu', this.onClick);
    }

    return leafletElement;
  }

  merc = new SphericalMercator({
    size: this.props.tileSize || 256,
  });

  createTile = (tileCoords, done) =>
    this.createTileExt(tileCoords, done, this.props);

  createTileAlt = (tileCoords, done) => {
    const props = { ...this.props };
    props.layers = props.layers.filter(layer =>
      ['Stops', 'Fluencies'].includes(layer.name),
    );

    return this.createTileExt(tileCoords, done, {
      ...props,
      isHighlight: true,
    });
  };

  createTileExt = (tileCoords, done, props) => {
    const tile = new TileContainer(
      tileCoords,
      done,
      props,
      this.context.config,
      this.context.location,
      this.context.map,
    );

    tile.onSelectableTargetClicked = (selectableTargets, coords) => {
      if (selectableTargets && this.props.disableMapTracking) {
        this.props.disableMapTracking(); // disable now that popup opens
      }

      let selectableTargetsFiltered = selectableTargets.filter(target =>
        isFeatureLayerEnabled(
          target.feature,
          target.layer,
          this.props.mapLayers,
          this.context.config,
        ),
      );

      selectableTargetsFiltered = uniqBy(selectableTargetsFiltered, item =>
        [
          get(item, 'feature.properties.id') ||
            get(item, 'feature.properties.code'),
          get(item, 'feature.properties.trafficDirection'),
          get(item, 'layer'),
        ].join('_'),
      );

      // Filter out all maintenance vehicle route layers that have jobId 0
      selectableTargetsFiltered = selectableTargetsFiltered.filter(target => {
        const layer = get(target, 'layer');
        const jobId = get(target, 'feature.properties.jobId');

        return layer !== 'maintenanceVehicles' || jobId !== 0;
      });

      // Filter out all road inspection vehicle route layers that have jobId 0
      selectableTargetsFiltered = selectableTargetsFiltered.filter(target => {
        const layer = get(target, 'layer');
        const jobId = get(target, 'feature.properties.jobId');

        return layer !== 'roadInspectionVehicles' || jobId !== 0;
      });

      // Filter out speedlimit or warning roadSigns without any display value
      selectableTargetsFiltered = selectableTargetsFiltered.filter(target => {
        const layer = get(target, 'layer');
        const type = get(target, 'feature.properties.type');
        const value = get(target, 'feature.properties.displayValue');
        const isValidSpeedLimit =
          type === 'SPEEDLIMIT' && value !== 'null' && !!value;
        const isValidWarning =
          type === 'WARNING' && value !== 'null' && !!value;
        const isInformation = type === 'INFORMATION';
        return (
          layer !== 'roadSigns' ||
          isValidSpeedLimit ||
          isValidWarning ||
          isInformation
        );
      });

      // Get targets with the shortest distance for each layer
      let closestTargets = selectableTargetsFiltered.reduce(
        (closestCollection, target) => {
          const targetLayer = get(target, 'layer');
          const targetDistance = get(target, 'feature.dist');
          const closestDistance = get(
            closestCollection,
            `${targetLayer}.feature.dist`,
          );

          // Skip if there's no distance available for the current target
          if (!targetDistance) {
            return closestCollection;
          }

          // If closest target is yet to be found or current target distance is shorter than
          // previously found shortest distance, set the current target as the closest one
          if (!closestDistance || targetDistance < closestDistance) {
            return { ...closestCollection, [targetLayer]: target };
          }
          return closestCollection;
        },
        {},
      );

      // There are partially overlapping geometries which might be older
      // than the one drawn in the UI but closer to the click target.
      // If maintenanceVehiclelayer is present, we check if there are
      // more currently timestamped layers slightly further than the closest target.
      // This is done to mitigate the scenario where we draw some actualization
      // in the UI but clicking near it would show a popup with another
      // actualization.
      const closestMaintenanceVehicleLayer = closestTargets.maintenanceVehicles;
      if (closestMaintenanceVehicleLayer) {
        const closestDist = get(closestMaintenanceVehicleLayer, 'feature.dist');
        const closeAndMoreRecentLayers = selectableTargetsFiltered
          .filter(
            target =>
              target.layer === 'maintenanceVehicles' &&
              get(target, 'feature.dist') - closestDist < 1,
          )
          .sort(
            (a, b) =>
              get(b, 'feature.properties.timestamp') -
              get(a, 'feature.properties.timestamp'),
          );
        if (closeAndMoreRecentLayers.length > 0) {
          closestTargets = {
            ...closestTargets,
            maintenanceVehicles: {
              ...closeAndMoreRecentLayers[0],
            },
          };
        }
      }
      // Filter out other than the closest targets
      selectableTargetsFiltered = selectableTargetsFiltered.filter(target => {
        if (closestTargets[target.layer]) {
          return (
            closestTargets[target.layer].feature.properties.id ===
              target.feature.properties.id &&
            closestTargets[target.layer].feature.dist === target.feature.dist
          );
        }
        return true;
      });

      this.setState({
        selectableTargets: selectableTargetsFiltered,
        coords,
        showSpinner: true,
      });
    };

    return tile.el;
  };

  selectRow = options =>
    this.setState({ selectableTargets: options, showSpinner: true });

  isAllSameLayers = name =>
    this.state.selectableTargets.filter(({ layer }) => layer !== name)
      .length === 0;

  renderLoadingPopup = () => (
    <div className="card" style={{ height: '12rem' }}>
      <Loading />
    </div>
  );

  renderLocationPopup = () => {
    const { coords } = this.state;

    return (
      <Popup
        key={coords.toString()}
        {...this.PopupOptions}
        maxHeight={220}
        position={coords}
      >
        <LocationPopup
          name="" // TODO: fill in name from reverse geocoding, possibly in a container.
          lat={coords.lat}
          lon={coords.lng}
        />
      </Popup>
    );
  };

  renderMarkerSelectPopup = () => {
    const { selectableTargets, coords } = this.state;

    return (
      <Popup
        key={coords.toString()}
        {...this.PopupOptions}
        maxHeight={220}
        position={coords}
      >
        <MarkerSelectPopup
          selectRow={this.selectRow}
          options={selectableTargets}
        />
      </Popup>
    );
  };

  render() {
    const { selectableTargets, coords, showSpinner } = this.state;

    // There is nothing to show.
    if (isEmpty(selectableTargets) && !coords) {
      return null;
    }

    // Show location popup if there's no selectable targets to show.
    if (isEmpty(selectableTargets)) {
      return this.renderLocationPopup();
    }

    // Show marker select popup if there's more than one selectable targets.
    if (selectableTargets.length > 1) {
      return this.renderMarkerSelectPopup();
    }

    let contents;
    let id;
    const popupOptions = {
      ...this.PopupOptions,
    };

    const selectableTarget = selectableTargets[0];

    // eslint-disable-next-line default-case
    switch (selectableTarget.layer) {
      case 'ecoCounters':
        popupOptions.maxWidth = 420;
        popupOptions.minWidth = 420;
        id = get(selectableTarget, 'feature.properties.id');

        contents = (
          <EcoCounterPopup
            domain={get(selectableTarget, 'feature.properties.domain')}
            name={get(selectableTarget, 'feature.properties.name')}
            channels={JSON.parse(
              get(selectableTarget, 'feature.properties.channels', '[]'),
            )}
          />
        );
        break;
      case 'stop':
        id = get(selectableTarget, 'feature.properties.gtfsId');
        contents = (
          <Relay.RootContainer
            Component={StopMarkerPopup}
            route={
              selectableTarget.feature.properties.stops
                ? new TerminalRoute({
                    terminalId: id,
                    currentTime: this.state.currentTime,
                  })
                : new StopRoute({
                    stopId: id,
                    currentTime: this.state.currentTime,
                  })
            }
            renderLoading={showSpinner ? this.renderLoadingPopup : undefined}
            renderFetched={data => <StopMarkerPopup {...data} />}
          />
        );
        break;
      case 'citybike':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={CityBikePopup}
            forceFetch
            route={
              new CityBikeRoute({
                stationId: id,
              })
            }
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <CityBikePopup {...data} />}
          />
        );
        break;
      case 'parkingStations':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={ParkingStationPopup}
            forceFetch
            route={new ParkingStationRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <ParkingStationPopup {...data} />}
          />
        );
        break;
      case 'parkAndRide':
        id = get(selectableTarget, 'feature.properties.facilityIds');
        if (id) {
          contents = (
            <Relay.RootContainer
              Component={ParkAndRideHubPopup}
              forceFetch
              route={new ParkAndRideHubRoute({ stationIds: JSON.parse(id) })}
              renderLoading={this.renderLoadingPopup}
              renderFetched={data => (
                <ParkAndRideHubPopup
                  name={
                    JSON.parse(
                      this.state.selectableTargets[0].feature.properties.name,
                    )[this.context.intl.locale]
                  }
                  lat={this.state.coords.lat}
                  lon={this.state.coords.lng}
                  {...data}
                />
              )}
            />
          );
        } else {
          id = get(selectableTarget, 'feature.id');
          contents = (
            <Relay.RootContainer
              Component={ParkAndRideFacilityPopup}
              forceFetch
              route={new ParkAndRideFacilityRoute({ id })}
              renderLoading={this.renderLoadingPopup}
              renderFetched={data => (
                <ParkAndRideFacilityPopup
                  name={
                    JSON.parse(
                      this.state.selectableTargets[0].feature.properties.name,
                    )[this.context.intl.locale]
                  }
                  lat={this.state.coords.lat}
                  lon={this.state.coords.lng}
                  {...data}
                />
              )}
            />
          );
        }
        break;
      case 'cityWeatherStations':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={CityWeatherStationPopup}
            forceFetch
            route={new CityWeatherStationRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <CityWeatherStationPopup {...data} />}
          />
        );
        break;
      case 'weatherStations':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={WeatherStationPopup}
            forceFetch
            route={new WeatherStationRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <WeatherStationPopup {...data} />}
          />
        );
        break;
      case 'tmsStations':
        id = get(selectableTarget, 'feature.properties.id');

        contents = (
          <Relay.RootContainer
            Component={TmsStationPopup}
            forceFetch
            route={new TmsStationRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <TmsStationPopup {...data} />}
          />
        );
        break;
      case 'ticketSales':
        id = get(selectableTarget, 'feature.properties.FID');
        contents = (
          <TicketSalesPopup
            {...this.state.selectableTargets[0].feature.properties}
          />
        );
        break;
      case 'cameraStations':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={CameraStationPopup}
            forceFetch
            route={new CameraStationRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <CameraStationPopup {...data} />}
          />
        );
        break;
      case 'roadworks':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={RoadworkPopup}
            forceFetch
            route={new RoadworkRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <RoadworkPopup {...data} />}
          />
        );
        break;
      case 'disorders':
        id = get(selectableTarget, 'feature.properties.id');
        if (
          get(selectableTarget, 'feature.properties.type') ===
          'TrafficAnnouncement'
        ) {
          contents = (
            <Relay.RootContainer
              Component={TrafficAnnouncementPopup}
              forceFetch
              route={new TrafficAnnouncementRoute({ id })}
              renderLoading={this.renderLoadingPopup}
              renderFetched={data => <TrafficAnnouncementPopup {...data} />}
            />
          );
        } else {
          contents = (
            <Relay.RootContainer
              Component={DisorderPopup}
              forceFetch
              route={new DisorderRoute({ id })}
              renderLoading={this.renderLoadingPopup}
              renderFetched={data => <DisorderPopup {...data} />}
            />
          );
        }
        break;
      case 'roadConditions':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={RoadConditionPopup}
            forceFetch
            route={new RoadConditionRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <RoadConditionPopup {...data} />}
          />
        );
        break;
      case 'roadInspectionVehicles':
      case 'maintenanceVehicles':
        popupOptions.maxWidth = 360;

        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={MaintenanceVehicleRoutePopup}
            forceFetch
            route={new MaintenanceVehicleRouteRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <MaintenanceVehicleRoutePopup {...data} />}
          />
        );
        break;
      case 'fluencies':
        id = get(selectableTarget, 'feature.properties.id');
        contents = <FluencyPopup {...selectableTarget.feature.properties} />;
        break;
      case 'roadSigns':
        id = get(selectableTarget, 'feature.properties.id');
        contents = (
          <Relay.RootContainer
            Component={RoadSignPopup}
            forceFetch
            route={new RoadSignRoute({ id })}
            renderLoading={this.renderLoadingPopup}
            renderFetched={data => <RoadSignPopup {...data} />}
          />
        );
        break;
      case 'bicycleRoutesBaana':
      case 'bicycleRoutesBrand':
      case 'bicycleRoutesMainRegional':
      case 'bicycleRouteTypes':
        contents = (
          <BicycleRoutePopup
            layer={selectableTarget.layer}
            {...selectableTarget.feature.properties}
          />
        );
        break;
    }

    if (!contents) {
      return this.renderLocationPopup();
    }

    return (
      <Popup {...popupOptions} key={id} position={this.state.coords}>
        {contents}
      </Popup>
    );
  }
}

export default connectToStores(
  TileLayerContainer,
  [MapLayerStore, MapLayerOptionsStore, MaintenanceVehicleTailStore],
  context => ({
    mapLayers: context.getStore(MapLayerStore).getMapLayers(),
    mapLayerOptions: context
      .getStore(MapLayerOptionsStore)
      .getMapLayerOptions(),
    highlightedStop: context.getStore(MapLayerStore).getHighlightedStop(),
    highlightedFluency: context.getStore(MapLayerStore).getHighlightedFluency(),
    maintenanceVehicleTail: context
      .getStore(MaintenanceVehicleTailStore)
      .getTail(),
    location: context.location,
  }),
);
