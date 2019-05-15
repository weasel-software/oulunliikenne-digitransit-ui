import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import some from 'lodash/some';
import get from 'lodash/get';
import mapProps from 'recompose/mapProps';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { routerShape } from 'react-router';

import StopPageTabContainer from './StopPageTabContainer';
import DepartureListHeader from './DepartureListHeader';
import DepartureListContainer from './DepartureListContainer';
import TimetableContainer from './TimetableContainer';
import Error404 from './404';
import withBreakpoint from '../util/withBreakpoint';

class StopPageContentOptions extends React.Component {
  static propTypes = {
    printUrl: PropTypes.string,
    departureProps: PropTypes.shape({
      stop: PropTypes.shape({
        stoptimes: PropTypes.array,
      }).isRequired,
    }).isRequired,
    relay: PropTypes.shape({
      variables: PropTypes.shape({
        date: PropTypes.string.isRequired,
      }).isRequired,
      setVariables: PropTypes.func.isRequired,
    }).isRequired,
    initialDate: PropTypes.string.isRequired,
    setDate: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
    realtimeDepartures: PropTypes.array,
  };

  static defaultProps = {
    printUrl: null,
    realtimeDepartures: undefined,
  };

  static contextTypes = {
    router: routerShape.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = {
      showTab: 'right-now', // Show right-now as default
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
      relay.setVariables({ startTime: currUnix });
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

  onDateChange = ({ target }) => {
    this.props.setDate(target.value);
  };

  setTab = val => {
    this.setState({
      showTab: val,
    });
  };

  toggleRealtimeMap = update => {
    this.setState({
      showRealtimeVehicles: !this.state.showRealtimeVehicles,
      updateRealtimeVehicles: update !== false,
    });
  };

  render() {
    const { showRealtimeVehicles, updateRealtimeVehicles } = this.state;

    // Currently shows only next departures, add Timetables
    return (
      <div className="stop-page-content-wrapper">
        <div>
          <StopPageTabContainer selectedTab={this.setTab} />
          <div className="stop-tabs-fillerline" />
          {this.state.showTab === 'right-now' && <DepartureListHeader />}
        </div>
        {this.state.showTab === 'right-now' && (
          <div className="stop-scroll-container momentum-scroll">
            <DepartureListContainerWithProps
              {...this.props.departureProps}
              showRealtimeVehicles={showRealtimeVehicles}
              updateRealtimeVehicles={updateRealtimeVehicles}
            />
          </div>
        )}
        {this.state.showTab === 'timetable' && (
          <TimetableContainer
            stop={this.props.departureProps.stop}
            date={this.props.relay.variables.date}
            propsForStopPageActionBar={{
              printUrl: this.props.printUrl,
              startDate: this.props.initialDate,
              selectedDate: this.props.relay.variables.date,
              onDateChange: this.onDateChange,
            }}
          />
        )}
      </div>
    );
  }
}

const DepartureListContainerWithProps = mapProps(props => ({
  stoptimes: props.stop.stoptimes,
  key: 'departures',
  className: 'stop-page momentum-scroll',
  routeLinks: true,
  infiniteScroll: true,
  isTerminal: !props.params.stopId,
  rowClasses: 'padding-normal border-bottom',
  currentTime: props.relay.variables.startTime,
  showPlatformCodes: true,
  showRealtimeVehicles: props.showRealtimeVehicles,
  updateRealtimeVehicles: props.updateRealtimeVehicles,
}))(DepartureListContainer);

const StopPageContent = withBreakpoint(
  props =>
    some(props.routes, 'fullscreenMap') &&
    props.breakpoint !== 'large' ? null : (
      <StopPageContentOptions
        printUrl={props.stop.url}
        departureProps={props}
        relay={props.relay}
        initialDate={props.initialDate}
        setDate={props.setDate}
        currentTime={props.currentTime}
      />
    ),
);

const StopPageContentOrEmpty = props => {
  if (props.stop) {
    return <StopPageContent {...props} />;
  }
  return <Error404 />;
};

StopPageContentOrEmpty.propTypes = {
  stop: PropTypes.shape({
    url: PropTypes.string,
  }).isRequired,
};

export default Relay.createContainer(
  connectToStores(
    StopPageContentOrEmpty,
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
      stop: ({ date }) => Relay.QL`
      fragment on Stop {
        url
        stoptimes: stoptimesWithoutPatterns(startTime: $startTime, timeRange: $timeRange, numberOfDepartures: $numberOfDepartures) {
          ${DepartureListContainer.getFragment('stoptimes')}
        }
        ${TimetableContainer.getFragment('stop', { date })}
      }
    `,
    },

    initialVariables: {
      startTime: 0,
      timeRange: 3600 * 12,
      numberOfDepartures: 100,
      date: null,
    },
  },
);
