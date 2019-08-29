import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import { routerShape } from 'react-router';

import PopupMock from './PopupMock';
import MarkerPopupBottom from '../MarkerPopupBottom';
import StopCardContainer from '../../StopCardContainer';
import ComponentUsageExample from '../../ComponentUsageExample';
import Icon from '../../Icon';
import {
  setHighlightedStop,
  removeHighlightedStop,
} from '../../../action/MapLayerActions';

import mockData from './StopMarkerPopup.mockdata';

const NUMBER_OF_DEPARTURES = 30;
const NUMBER_OF_DEPARTURES_LIMIT = 15;
const STOP_TIME_RANGE = 12 * 60 * 60;
const TERMINAL_TIME_RANGE = 60 * 60;

class StopMarkerPopup extends React.PureComponent {
  constructor(props, { router }) {
    super(props);
    this.state = {
      showRealtimeVehicles: false,
      hasRealtimeVehicles: false,
      updateRealtimeVehicles: true,
      isStopPage: !!router.params.stopId,
    };
  }

  componentDidMount() {
    const { stopsShowRealtimeTrackingDefault } = this.context.config;
    if (!this.state.isStopPage && stopsShowRealtimeTrackingDefault) {
      this.toggleRealtimeMap();
    }

    const stop = this.props.stop.gtfsId || this.props.terminal.gtfsId;
    this.context.executeAction(setHighlightedStop, stop);
  }

  componentWillReceiveProps({ relay, currentTime, realtimeDepartures }) {
    const currUnix = this.props.currentTime;
    if (currUnix !== currentTime) {
      relay.setVariables({ currentTime: currUnix });
    }
    if (realtimeDepartures === null && this.state.showRealtimeVehicles) {
      this.toggleRealtimeMap(false);
    }
  }

  componentWillUnmount() {
    this.context.executeAction(removeHighlightedStop);
  }

  toggleRealtimeMap = update => {
    this.setState(prevState => ({
      showRealtimeVehicles: !prevState.showRealtimeVehicles,
      updateRealtimeVehicles: update !== false,
    }));
  };

  hasRealtimeVehicles = () => {
    this.setState({ hasRealtimeVehicles: true });
  };

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  render() {
    const {
      showRealtimeVehicles,
      hasRealtimeVehicles,
      updateRealtimeVehicles,
      isStopPage,
    } = this.state;
    const {
      config: { stopsShowRealtimeTracking },
      intl,
    } = this.context;
    const stop = this.props.stop || this.props.terminal;
    const terminal = this.props.terminal !== null;

    return (
      <div className="card">
        <StopCardContainer
          stop={stop}
          numberOfDepartures={NUMBER_OF_DEPARTURES}
          startTime={this.props.relay.variables.currentTime}
          isTerminal={terminal}
          timeRange={terminal ? TERMINAL_TIME_RANGE : STOP_TIME_RANGE}
          limit={NUMBER_OF_DEPARTURES_LIMIT}
          className="padding-small cursor-pointer"
          showRealtimeVehicles={showRealtimeVehicles}
          updateRealtimeVehicles={updateRealtimeVehicles}
          hasRealtimeVehicles={this.hasRealtimeVehicles}
        />
        <MarkerPopupBottom
          location={{
            address: stop.name,
            lat: stop.lat,
            lon: stop.lon,
          }}
        >
          {!isStopPage &&
            stopsShowRealtimeTracking &&
            hasRealtimeVehicles && (
              <div
                className="route cursor-pointer special"
                onClick={this.toggleRealtimeMap}
                title={intl.formatMessage(
                  showRealtimeVehicles
                    ? {
                        id: 'hide-realtime-on-map',
                        defaultMessage: 'Hide vehicles on map',
                      }
                    : {
                        id: 'show-realtime-on-map',
                        defaultMessage: 'Show vehicles on map',
                      },
                )}
              >
                <Icon
                  img={
                    showRealtimeVehicles
                      ? 'icon-icon_realtime_off'
                      : 'icon-icon_realtime_on'
                  }
                />
              </div>
            )}
        </MarkerPopupBottom>
      </div>
    );
  }
}

StopMarkerPopup.propTypes = {
  stop: PropTypes.object,
  terminal: PropTypes.object,
  currentTime: PropTypes.number.isRequired,
  relay: PropTypes.shape({
    variables: PropTypes.shape({
      currentTime: PropTypes.number.isRequired,
    }).isRequired,
    setVariables: PropTypes.func.isRequired,
  }).isRequired,
  realtimeDepartures: PropTypes.array,
};

StopMarkerPopup.defaultProps = {
  realtimeDepartures: undefined,
};

StopMarkerPopup.contextTypes = {
  intl: intlShape.isRequired,
  config: PropTypes.shape({
    stopsShowRealtimeTracking: PropTypes.bool,
    stopsShowRealtimeTrackingDefault: PropTypes.bool,
  }),
  executeAction: PropTypes.func.isRequired,
  router: routerShape.isRequired,
};

const StopMarkerPopupContainer = Relay.createContainer(
  connectToStores(
    StopMarkerPopup,
    ['TimeStore', 'RealtimeDeparturesStore'],
    ({ getStore }) => ({
      currentTime: getStore('TimeStore')
        .getCurrentTime()
        .unix(),
      realtimeDepartures: getStore('RealtimeDeparturesStore').getDepartures(),
    }),
  ),
  {
    fragments: {
      stop: ({ currentTime }) => Relay.QL`
      fragment on Stop{
        gtfsId
        lat
        lon
        name
        ${StopCardContainer.getFragment('stop', {
          startTime: currentTime,
          timeRange: STOP_TIME_RANGE,
          numberOfDepartures: NUMBER_OF_DEPARTURES,
        })}
      }
    `,
      terminal: ({ currentTime }) => Relay.QL`
      fragment on Stop{
        gtfsId
        lat
        lon
        name
        ${StopCardContainer.getFragment('stop', {
          startTime: currentTime,
          timeRange: TERMINAL_TIME_RANGE,
          numberOfDepartures: NUMBER_OF_DEPARTURES,
        })}
      }
    `,
    },
    initialVariables: {
      currentTime: 0,
    },
  },
);

StopMarkerPopupContainer.displayName = 'StopMarkerPopup';

StopMarkerPopupContainer.description = () => (
  <div>
    <ComponentUsageExample description="empty">
      <PopupMock size="small">
        <StopMarkerPopupContainer
          {...mockData.empty}
          currentTime={moment().unix()}
        />
      </PopupMock>
    </ComponentUsageExample>
    <ComponentUsageExample description="basic">
      <PopupMock>
        <StopMarkerPopupContainer
          {...mockData.basic}
          currentTime={mockData.currentTime}
        />
      </PopupMock>
    </ComponentUsageExample>
    <ComponentUsageExample description="realTime">
      <PopupMock>
        <StopMarkerPopupContainer
          {...mockData.realTime}
          currentTime={mockData.currentTime}
        />
      </PopupMock>
    </ComponentUsageExample>
    <ComponentUsageExample description="tomorrow">
      <PopupMock size="large">
        <StopMarkerPopupContainer
          {...mockData.tomorrow}
          currentTime={moment(mockData.currentTime)
            .subtract(1, 'days')
            .unix()}
        />
      </PopupMock>
    </ComponentUsageExample>
    <ComponentUsageExample description="missingPlatform">
      <PopupMock size="large">
        <StopMarkerPopupContainer
          {...mockData.missingPlatform}
          currentTime={mockData.currentTime}
        />
      </PopupMock>
    </ComponentUsageExample>
  </div>
);

export default StopMarkerPopupContainer;
