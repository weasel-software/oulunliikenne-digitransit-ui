import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import cx from 'classnames';
import getContext from 'recompose/getContext';
import Relay from 'react-relay/classic';
import some from 'lodash/some';
import { routerShape } from 'react-router';
import MapContainer from './map/MapContainer';
import SelectedStopPopup from './map/popups/SelectedStopPopup';
import SelectedStopPopupContent from './SelectedStopPopupContent';
import Icon from './Icon';
import withBreakpoint from '../util/withBreakpoint';
import {
  startRealTimeClient,
  stopRealTimeClient,
  updateTopic,
} from '../action/realTimeClientAction';
import {
  startRealTimeClient as altStartRealTimeClient,
  stopRealTimeClient as altStopRealTimeClient,
  updateTopic as altUpdateTopic,
} from '../action/altRealTimeClientAction';
import { clearDepartures } from '../action/RealtimeDeparturesActions';
import VehicleMarkerContainer from './map/VehicleMarkerContainer';

const getFullscreenTogglePath = (fullscreenMap, params) =>
  `/${params.stopId ? 'pysakit' : 'terminaalit'}/${
    params.stopId ? params.stopId : params.terminalId
  }${fullscreenMap ? '' : '/kartta'}`;

const toggleFullscreenMap = (fullscreenMap, params, router) => {
  if (fullscreenMap) {
    router.goBack();
    return;
  }
  router.push(getFullscreenTogglePath(fullscreenMap, params));
};

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
const fullscreenMapOverlay = (fullscreenMap, params, router) =>
  !fullscreenMap && (
    <div
      className="map-click-prevent-overlay"
      key="overlay"
      onClick={() => {
        toggleFullscreenMap(fullscreenMap, params, router);
      }}
    />
  );

const fullscreenMapToggle = (fullscreenMap, params, router) => (
  <div
    className={cx('fullscreen-toggle', 'stopPage', {
      expanded: fullscreenMap,
    })}
    key="fullscreen-toggle"
    onClick={() => {
      toggleFullscreenMap(fullscreenMap, params, router);
    }}
  >
    {fullscreenMap ? (
      <Icon img="icon-icon_minimize" className="cursor-pointer" />
    ) : (
      <Icon img="icon-icon_maximize" className="cursor-pointer" />
    )}
  </div>
);
/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

class StopPageMap extends React.Component {
  componentWillReceiveProps(newProps) {
    if (newProps.realtimeDepartures !== this.props.realtimeDepartures) {
      this.setRealtimeClient(newProps.realtimeDepartures);
    }
  }

  componentWillUnmount() {
    this.deactivateRealtimeVehicles();
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

  deactivateRealtimeVehicles = () => {
    this.props.executeAction(clearDepartures);
  };

  render() {
    const {
      stop,
      routes,
      params,
      breakpoint,
      realtimeDepartures,
      router,
      intl,
    } = this.props;

    if (!stop) {
      return false;
    }

    const fullscreenMap = some(routes, 'fullscreenMap');
    const leafletObjs = [];
    const children = [];

    if (breakpoint === 'large') {
      leafletObjs.push(
        <SelectedStopPopup
          lat={stop.lat}
          lon={stop.lon}
          key="SelectedStopPopup"
        >
          <SelectedStopPopupContent stop={stop} />
        </SelectedStopPopup>,
      );
    } else {
      children.push(fullscreenMapOverlay(fullscreenMap, params, router));
      children.push(fullscreenMapToggle(fullscreenMap, params, router));
    }

    if (realtimeDepartures && realtimeDepartures.length > 0) {
      children.push(
        <button
          className="realtime-toggle realtime-toggle-stop"
          onClick={this.deactivateRealtimeVehicles}
          title={intl.formatMessage({
            id: 'hide-realtime-on-map',
            defaultMessage: 'Hide vehicles on map',
          })}
          key="realtime-toggle"
        >
          <Icon img="icon-icon_realtime_off" />
        </button>,
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

    const showScale = fullscreenMap || breakpoint === 'large';

    return (
      <MapContainer
        className="full"
        lat={stop.lat}
        lon={stop.lon}
        zoom={!params.stopId || stop.platformCode ? 18 : 16}
        showStops
        hilightedStops={[params.stopId]}
        leafletObjs={leafletObjs}
        showScaleBar={showScale}
      >
        {children}
      </MapContainer>
    );
  }
}

StopPageMap.propTypes = {
  stop: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    platformCode: PropTypes.string,
  }).isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      fullscreenMap: PropTypes.string,
    }).isRequired,
  ).isRequired,
  params: PropTypes.oneOfType([
    PropTypes.shape({ stopId: PropTypes.string.isRequired }).isRequired,
    PropTypes.shape({ terminalId: PropTypes.string.isRequired }).isRequired,
  ]).isRequired,
  breakpoint: PropTypes.string.isRequired,
  realtimeDepartures: PropTypes.array,
  router: routerShape.isRequired,
  config: PropTypes.object.isRequired,
  executeAction: PropTypes.func.isRequired,
  getStore: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

StopPageMap.defaultProps = {
  realtimeDepartures: null,
};

export default Relay.createContainer(
  withBreakpoint(
    connectToStores(
      getContext({
        router: routerShape.isRequired,
        config: PropTypes.object.isRequired,
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired,
        intl: intlShape.isRequired,
      })(StopPageMap),
      ['RealtimeDeparturesStore'],
      ({ getStore }) => ({
        realtimeDepartures: getStore('RealtimeDeparturesStore').getDepartures(),
      }),
    ),
  ),
  {
    fragments: {
      stop: () => Relay.QL`
        fragment on Stop {
          lat
          lon
          platformCode
          name
          code
          desc
        }
      `,
    },
  },
);
