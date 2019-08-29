import connectToStores from 'fluxible-addons-react/connectToStores';
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import GridLayer from 'react-leaflet/es/GridLayer';
import SphericalMercator from '@mapbox/sphericalmercator';
import lodashFilter from 'lodash/filter';
import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import Popup from 'react-leaflet/es/Popup';
import { withLeaflet } from 'react-leaflet/es/context';

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
import LocationPopup from '../popups/LocationPopup';
import TileContainer from './TileContainer';
import Loading from '../../Loading';
import { isFeatureLayerEnabled } from '../../../util/mapLayerUtils';
import MapLayerStore, { mapLayerShape } from '../../../store/MapLayerStore';
import EcoCounterPopup from '../popups/EcoCounterPopup';
import { isBrowser } from '../../../util/browser';

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
    leaflet: PropTypes.shape({
      map: PropTypes.shape({
        addLayer: PropTypes.func.isRequired,
        addEventParent: PropTypes.func.isRequired,
        removeEventParent: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    highlightedStop: PropTypes.string,
    highlightedFluency: PropTypes.string,
  };

  static defaultProps = {
    highlightedStop: null,
    highlightedFluency: null,
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    config: PropTypes.object.isRequired,
  };

  PopupOptions = {
    offset: [110, 16],
    minWidth: 260,
    maxWidth: 260,
    autoPanPaddingTopLeft: [5, 125],
    className: 'popup',
    ref: 'popup',
    onClose: () => this.setState(initialState),
    autoPan: false,
  };

  merc = new SphericalMercator({
    size: this.props.tileSize || 256,
  });

  constructor(props, context) {
    super(props, context);

    // Required as it is not passed upwards through the whole inherittance chain
    this.context = context;
    this.state = {
      ...initialState,
      currentTime: context
        .getStore('TimeStore')
        .getCurrentTime()
        .unix(),
    };
    this.leafletElement.createTile = this.createTile;
  }

  componentDidMount() {
    super.componentDidMount();
    this.context.getStore('TimeStore').addChangeListener(this.onTimeChange);
    this.props.leaflet.map.addEventParent(this.leafletElement);
    this.leafletElement.on('click contextmenu', this.onClick);
  }

  componentDidUpdate(prevProps) {
    if (this.context.popupContainer != null) {
      this.context.popupContainer.openPopup();
    }
    if (!isEqual(prevProps.mapLayers, this.props.mapLayers)) {
      this.leafletElement.redraw();
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

  createTile = (tileCoords, done) => {
    const tile = new TileContainer(
      tileCoords,
      done,
      this.props,
      this.context.config,
    );

    tile.onSelectableTargetClicked = (selectableTargets, coords) => {
      if (selectableTargets && this.props.disableMapTracking) {
        this.props.disableMapTracking(); // disable now that popup opens
      }

      let selectableTargetsFiltered = uniqBy(
        selectableTargets.filter(target =>
          isFeatureLayerEnabled(
            target.feature,
            target.layer,
            this.props.mapLayers,
            this.context.config,
          ),
        ),
        item =>
          `${get(item, 'feature.properties.id') ||
            get(item, 'feature.properties.code')}_${get(item, 'layer')}`,
      );

      // Prevent some of the items from showing up in select-popup
      if (selectableTargetsFiltered.length > 1) {
        selectableTargetsFiltered = selectableTargetsFiltered.filter(
          target => !['fluencies'].includes(target.layer),
        );
      }

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

  render() {
    let popup = null;
    let contents;

    const loadingPopup = () => (
      <div className="card" style={{ height: '12rem' }}>
        <Loading />
      </div>
    );

    if (typeof this.state.selectableTargets !== 'undefined') {
      if (
        this.state.selectableTargets.length >= 1 &&
        this.isAllSameLayers('ecoCounters')
      ) {
        const width =
          isBrowser && window.innerWidth < 420 ? window.innerWidth - 5 : 420;
        const options = {
          maxWidth: width,
          minWidth: width,
        };
        const channels = this.state.selectableTargets.map(({ feature }) => ({
          ...feature.properties,
        }));
        popup = (
          <Popup
            {...{ ...this.PopupOptions, ...options }}
            key={this.state.selectableTargets[0].feature.properties.id}
            position={this.state.coords}
          >
            <EcoCounterPopup channels={channels} />
          </Popup>
        );
      } else if (this.state.selectableTargets.length === 1) {
        let id;
        if (this.state.selectableTargets[0].layer === 'stop') {
          id = this.state.selectableTargets[0].feature.properties.gtfsId;
          contents = (
            <Relay.RootContainer
              Component={StopMarkerPopup}
              route={
                this.state.selectableTargets[0].feature.properties.stops
                  ? new TerminalRoute({
                      terminalId: id,
                      currentTime: this.state.currentTime,
                    })
                  : new StopRoute({
                      stopId: id,
                      currentTime: this.state.currentTime,
                    })
              }
              renderLoading={this.state.showSpinner ? loadingPopup : undefined}
              renderFetched={data => <StopMarkerPopup {...data} />}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'citybike') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={CityBikePopup}
              forceFetch
              route={
                new CityBikeRoute({
                  stationId: id,
                })
              }
              renderLoading={loadingPopup}
              renderFetched={data => <CityBikePopup {...data} />}
            />
          );
        } else if (
          this.state.selectableTargets[0].layer === 'parkingStations'
        ) {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={ParkingStationPopup}
              forceFetch
              route={new ParkingStationRoute({ id })}
              renderLoading={loadingPopup}
              renderFetched={data => <ParkingStationPopup {...data} />}
            />
          );
        } else if (
          this.state.selectableTargets[0].layer === 'parkAndRide' &&
          this.state.selectableTargets[0].feature.properties.facilityIds
        ) {
          id = this.state.selectableTargets[0].feature.properties.facilityIds;
          contents = (
            <Relay.RootContainer
              Component={ParkAndRideHubPopup}
              forceFetch
              route={new ParkAndRideHubRoute({ stationIds: JSON.parse(id) })}
              renderLoading={loadingPopup}
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
        } else if (this.state.selectableTargets[0].layer === 'parkAndRide') {
          ({ id } = this.state.selectableTargets[0].feature);
          contents = (
            <Relay.RootContainer
              Component={ParkAndRideFacilityPopup}
              forceFetch
              route={new ParkAndRideFacilityRoute({ id })}
              renderLoading={loadingPopup}
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
        } else if (
          this.state.selectableTargets[0].layer === 'weatherStations'
        ) {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={WeatherStationPopup}
              forceFetch
              route={new WeatherStationRoute({ id })}
              renderLoading={loadingPopup}
              renderFetched={data => <WeatherStationPopup {...data} />}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'tmsStations') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={TmsStationPopup}
              forceFetch
              route={new TmsStationRoute({ id })}
              renderLoading={loadingPopup}
              renderFetched={data => <TmsStationPopup {...data} />}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'ticketSales') {
          id = this.state.selectableTargets[0].feature.properties.FID;
          contents = (
            <TicketSalesPopup
              {...this.state.selectableTargets[0].feature.properties}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'cameraStations') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={CameraStationPopup}
              forceFetch
              route={new CameraStationRoute({ id })}
              renderLoading={loadingPopup}
              renderFetched={data => <CameraStationPopup {...data} />}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'roadworks') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={RoadworkPopup}
              forceFetch
              route={new RoadworkRoute({ id })}
              renderLoading={loadingPopup}
              renderFetched={data => <RoadworkPopup {...data} />}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'disorders') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents =
            get(this.state.selectableTargets[0], 'feature.properties.type') ===
            'TrafficAnnouncement' ? (
              <Relay.RootContainer
                Component={TrafficAnnouncementPopup}
                forceFetch
                route={new TrafficAnnouncementRoute({ id })}
                renderLoading={loadingPopup}
                renderFetched={data => <TrafficAnnouncementPopup {...data} />}
              />
            ) : (
              <Relay.RootContainer
                Component={DisorderPopup}
                forceFetch
                route={new DisorderRoute({ id })}
                renderLoading={loadingPopup}
                renderFetched={data => <DisorderPopup {...data} />}
              />
            );
        } else if (this.state.selectableTargets[0].layer === 'roadConditions') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <Relay.RootContainer
              Component={RoadConditionPopup}
              forceFetch
              route={new RoadConditionRoute({ id })}
              renderLoading={loadingPopup}
              renderFetched={data => <RoadConditionPopup {...data} />}
            />
          );
        } else if (this.state.selectableTargets[0].layer === 'fluencies') {
          ({ id } = this.state.selectableTargets[0].feature.properties);
          contents = (
            <FluencyPopup
              {...this.state.selectableTargets[0].feature.properties}
            />
          );
        }
        popup = (
          <Popup {...this.PopupOptions} key={id} position={this.state.coords}>
            {contents}
          </Popup>
        );
      } else if (this.state.selectableTargets.length > 1) {
        popup = (
          <Popup
            key={this.state.coords.toString()}
            {...this.PopupOptions}
            maxHeight={220}
            position={this.state.coords}
          >
            <MarkerSelectPopup
              selectRow={this.selectRow}
              options={this.state.selectableTargets}
            />
          </Popup>
        );
      } else if (this.state.selectableTargets.length === 0) {
        popup = (
          <Popup
            key={this.state.coords.toString()}
            {...this.PopupOptions}
            maxHeight={220}
            position={this.state.coords}
          >
            <LocationPopup
              name="" // TODO: fill in name from reverse geocoding, possibly in a container.
              lat={this.state.coords.lat}
              lon={this.state.coords.lng}
            />
          </Popup>
        );
      }
    }

    return popup;
  }
}

export default withLeaflet(
  connectToStores(TileLayerContainer, [MapLayerStore], context => ({
    mapLayers: context.getStore(MapLayerStore).getMapLayers(),
    highlightedStop: context.getStore(MapLayerStore).getHighlightedStop(),
    highlightedFluency: context.getStore(MapLayerStore).getHighlightedFluency(),
  })),
);
