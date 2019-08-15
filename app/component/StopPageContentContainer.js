import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import get from 'lodash/get';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { routerShape } from 'react-router';

import DepartureListHeader from './DepartureListHeader';
import DepartureListContainer from './DepartureListContainer';
import Error404 from './404';

class StopPageContent extends React.Component {
  static propTypes = {
    params: PropTypes.oneOfType([
      PropTypes.shape({ stopId: PropTypes.string.isRequired }).isRequired,
      PropTypes.shape({ terminalId: PropTypes.string.isRequired }).isRequired,
    ]).isRequired,
    stop: PropTypes.shape({
      stoptimes: PropTypes.array,
    }).isRequired,
    relay: PropTypes.shape({
      variables: PropTypes.shape({
        startTime: PropTypes.string.isRequired,
      }).isRequired,
      setVariables: PropTypes.func.isRequired,
    }).isRequired,
    currentTime: PropTypes.number.isRequired,
    realtimeDepartures: PropTypes.array,
  };

  static contextTypes = {
    router: routerShape.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = {
      showRealtimeVehicles: false,
      updateRealtimeVehicles: true,
      stopId: get(context, 'router.params.stopId'),
    };
  }

  componentDidMount() {
    this.toggleRealtimeMap();
  }

  componentWillReceiveProps({ relay, currentTime, realtimeDepartures }) {
    const currUnix = this.props.currentTime;
    if (currUnix !== currentTime) {
      relay.setVariables({ startTime: String(currUnix) });
    }
    if (this.state.showRealtimeVehicles) {
      if (realtimeDepartures === null) {
        this.toggleRealtimeMap(false);
      }
    } else if (
      this.state.stopId !== get(this.context, 'router.params.stopId') &&
      realtimeDepartures !== null
    ) {
      this.setState({
        stopId: get(this.context, 'router.params.stopId'),
      });
      this.toggleRealtimeMap();
    }
  }

  toggleRealtimeMap = update => {
    this.setState({
      showRealtimeVehicles: !this.state.showRealtimeVehicles,
      updateRealtimeVehicles: update !== false,
    });
  };

  render() {
    const { showRealtimeVehicles, updateRealtimeVehicles } = this.state;

    if (!this.props.stop) {
      return <Error404 />;
    }

    return (
      <React.Fragment>
        <DepartureListHeader />
        <div className="stop-scroll-container momentum-scroll">
          <DepartureListContainer
            stoptimes={this.props.stop.stoptimes}
            key="departures"
            className="stop-page momentum-scroll"
            routeLinks
            infiniteScroll
            isTerminal={!this.props.params.stopId}
            rowClasses="padding-normal border-bottom"
            currentTime={this.props.currentTime}
            showRealtimeVehicles={showRealtimeVehicles}
            updateRealtimeVehicles={updateRealtimeVehicles}
            showPlatformCodes
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Relay.createContainer(
  connectToStores(StopPageContent, ['TimeStore'], ({ getStore }) => ({
    currentTime: getStore('TimeStore')
      .getCurrentTime()
      .unix(),
  })),
  {
    fragments: {
      stop: () => Relay.QL`
      fragment on Stop {
        url
        stoptimes: stoptimesWithoutPatterns(startTime: $startTime, timeRange: $timeRange, numberOfDepartures: $numberOfDepartures) {
          ${DepartureListContainer.getFragment('stoptimes')}
        }
      }
    `,
    },

    initialVariables: {
      startTime: String(0),
      timeRange: 3600 * 12,
      numberOfDepartures: 100,
    },
  },
);
