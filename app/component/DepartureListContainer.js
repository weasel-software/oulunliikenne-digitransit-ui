import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Relay from 'react-relay/classic';
import get from 'lodash/get';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import difference from 'lodash/difference';
import moment from 'moment';
import { Link, routerShape } from 'react-router';
import getContext from 'recompose/getContext';
import cx from 'classnames';
import Departure from './Departure';
import { isBrowser } from '../util/browser';
import { PREFIX_ROUTES } from '../util/path';
import {
  updateDepartures,
  clearDepartures,
} from '../action/RealtimeDeparturesActions';

const hasActiveDisruption = (t, alerts) =>
  filter(
    alerts,
    alert => alert.effectiveStartDate < t && t < alert.effectiveEndDate,
  ).length > 0;

const asDepartures = stoptimes =>
  !stoptimes
    ? []
    : stoptimes.map(stoptime => {
        const isArrival = stoptime.pickupType === 'NONE';
        let isLastStop = false;
        if (stoptime.trip && stoptime.trip.stops) {
          const lastStop = stoptime.trip.stops.slice(-1).pop();
          isLastStop = stoptime.stop.id === lastStop.id;
        }
        /* OTP returns either scheduled time or realtime prediction in
           * 'realtimeDeparture' and 'realtimeArrival' fields.
           * EXCEPT when state is CANCELLED, then it returns -1 for realtime  */
        const canceled = stoptime.realtimeState === 'CANCELED';
        const arrivalTime =
          stoptime.serviceDay +
          (!canceled ? stoptime.realtimeArrival : stoptime.scheduledArrival);
        const departureTime =
          stoptime.serviceDay +
          (!canceled
            ? stoptime.realtimeDeparture
            : stoptime.scheduledDeparture);
        const stoptimeTime = isArrival ? arrivalTime : departureTime;

        return {
          canceled,
          isArrival,
          isLastStop,
          stoptime: stoptimeTime,
          stop: stoptime.stop,
          realtime: stoptime.realtime,
          pattern: stoptime.trip.pattern,
          headsign: stoptime.stopHeadsign,
          trip: stoptime.trip,
          pickupType: stoptime.pickupType,
        };
      });

class DepartureListContainer extends Component {
  static propTypes = {
    rowClasses: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    stoptimes: PropTypes.array.isRequired,
    currentTime: PropTypes.number.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    limit: PropTypes.number,
    infiniteScroll: PropTypes.bool,
    showStops: PropTypes.bool,
    routeLinks: PropTypes.bool,
    className: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    isTerminal: PropTypes.bool,
    showPlatformCodes: PropTypes.bool,
    showRealtimeVehicles: PropTypes.bool,
    hasRealtimeVehicles: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    updateRealtimeVehicles: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    router: routerShape.isRequired,
  };

  static defaultProps = {
    showPlatformCodes: false,
    showRealtimeVehicles: false,
    hasRealtimeVehicles: undefined,
    updateRealtimeVehicles: true,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    config: PropTypes.shape({
      stopsRealtimeTrackingLimit: PropTypes.number,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      stopId: get(props, 'router.params.stopId'),
    };
  }

  componentDidMount() {
    const {
      config: { stopsRealtimeTrackingLimit },
    } = this.context;
    const departures = uniqBy(
      this.getDepartures(stopsRealtimeTrackingLimit),
      item => item.pattern.code,
    );

    if (Array.isArray(departures) && departures.length) {
      const { hasRealtimeVehicles } = this.props;
      if (hasRealtimeVehicles) {
        hasRealtimeVehicles();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    const { showRealtimeVehicles } = this.props;
    const { stopId } = this.state;
    const { executeAction } = this.context;
    if (newProps.updateRealtimeVehicles) {
      const {
        config: { stopsRealtimeTrackingLimit },
      } = this.context;
      const departures = uniqBy(
        this.getDepartures(stopsRealtimeTrackingLimit),
        item => item.pattern.code,
      );
      const departuresNew = uniqBy(
        this.getDepartures(stopsRealtimeTrackingLimit, newProps),
        item => item.pattern.code,
      );

      if (
        newProps.showRealtimeVehicles &&
        (newProps.showRealtimeVehicles !== showRealtimeVehicles ||
          (get(newProps, 'router.params.stopId') &&
            get(newProps, 'router.params.stopId') !== stopId &&
            difference(
              departures.map(departure =>
                get(departure, 'pattern.route.gtfsId'),
              ),
              departuresNew.map(departure =>
                get(departure, 'pattern.route.gtfsId'),
              ),
            ).length > 0))
      ) {
        executeAction(updateDepartures, departuresNew);

        if (get(newProps, 'router.params.stopId')) {
          this.setState({
            stopId: get(newProps, 'router.params.stopId'),
          });
        }
      } else if (
        newProps.showRealtimeVehicles !== showRealtimeVehicles &&
        !newProps.showRealtimeVehicles
      ) {
        executeAction(clearDepartures);
      }
    }
  }

  onScroll = () => {
    const { infiniteScroll } = this.props;
    if (infiniteScroll && isBrowser) {
      return this.scrollHandler;
    }
    return null;
  };

  getDepartures = (definedLimit, props) => {
    const { currentTime, isTerminal, stoptimes, limit } = props || this.props;
    // eslint-disable-next-line no-param-reassign
    definedLimit = definedLimit || limit;

    const departures = asDepartures(stoptimes)
      .filter(departure => !(isTerminal && departure.isArrival))
      .filter(departure => currentTime < departure.stoptime);

    return departures.slice(0, limit);
  };

  render() {
    const departureObjs = [];
    const {
      currentTime,
      showStops,
      rowClasses,
      showPlatformCodes,
      routeLinks,
      className,
    } = this.props;
    let currentDate = moment
      .unix(currentTime)
      .startOf('day')
      .unix();
    let tomorrow = moment
      .unix(currentTime)
      .add(1, 'day')
      .startOf('day')
      .unix();

    const departures = this.getDepartures();

    departures.forEach(departure => {
      if (departure.stoptime >= tomorrow) {
        departureObjs.push(
          <div
            key={moment.unix(departure.stoptime).format('DDMMYYYY')}
            className="date-row border-bottom"
          >
            {moment.unix(departure.stoptime).format('dddd D.M.YYYY')}
          </div>,
        );

        currentDate = tomorrow;
        tomorrow = moment
          .unix(currentDate)
          .add(1, 'day')
          .startOf('day')
          .unix();
      }

      const id = `${departure.pattern.code}:${departure.stoptime}`;

      const classes = {
        disruption: hasActiveDisruption(departure.stoptime, departure.alerts),
      };

      const departureObj = (
        <Departure
          key={id}
          departure={departure}
          showStop={showStops}
          currentTime={currentTime}
          hasDisruption={classes.disruption}
          className={cx(classes, rowClasses)}
          canceled={departure.canceled}
          isArrival={departure.isArrival}
          isLastStop={departure.isLastStop}
          showPlatformCode={showPlatformCodes}
        />
      );

      if (routeLinks) {
        departureObjs.push(
          <Link
            to={`/${PREFIX_ROUTES}/${departure.pattern.route.gtfsId}/pysakit/${
              departure.pattern.code
            }`}
            key={id}
          >
            {departureObj}
          </Link>,
        );
      } else {
        departureObjs.push(departureObj);
      }
    });

    return (
      <div
        className={cx('departure-list', className)}
        onScroll={this.onScroll()}
      >
        {departureObjs}
      </div>
    );
  }
}

export default Relay.createContainer(
  getContext({
    router: routerShape.isRequired,
  })(DepartureListContainer),
  {
    fragments: {
      stoptimes: () => Relay.QL`
        fragment on Stoptime @relay(plural:true) {
            realtimeState
            realtimeDeparture
            scheduledDeparture
            realtimeArrival
            scheduledArrival
            realtime
            serviceDay
            pickupType
            stopHeadsign
            stop {
              id
              code
              platformCode
            }
            trip {
              gtfsId
              tripHeadsign
              stops {
                id
                code
                gtfsId
              }
              alerts {
                effectiveStartDate
                effectiveEndDate
              }
              pattern {
                route {
                  gtfsId
                  shortName
                  longName
                  mode
                  color
                  alerts {
                    id
                    effectiveStartDate
                    effectiveEndDate
                  }
                  agency {
                    name
                  }
                }
                code
              }
            }
          }
      `,
    },
  },
);
