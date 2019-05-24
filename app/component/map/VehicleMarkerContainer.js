import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import cx from 'classnames';

import RouteMarkerPopup from './route/RouteMarkerPopup';
import FuzzyTripRoute from '../../route/FuzzyTripRoute';
import IconWithTail from '../IconWithTail';
import IconMarker from './IconMarker';
import Loading from '../Loading';

import { isBrowser } from '../../util/browser';

const MODES_WITH_ICONS = ['bus', 'tram', 'rail', 'subway', 'ferry'];

let Popup;

function getVehicleIcon(mode, heading, shortName, className) {
  if (!isBrowser) {
    return null;
  }

  const filteredMode = MODES_WITH_ICONS.includes(mode) ? mode : 'bus';

  return {
    element: (
      <IconWithTail
        img={`icon-icon_${filteredMode}${shortName ? '_text' : ''}-live`}
        rotate={heading}
      >
        {shortName && (
          <text
            x="50%"
            y="50%"
            dy=".3em"
            className={cx('icon-text', {
              medium: shortName.length > 2,
              long: shortName.length > 3,
            })}
          >
            {shortName}
          </text>
        )}
      </IconWithTail>
    ),
    className: `${className || 'vehicle-icon'} ${filteredMode}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  };
}

if (isBrowser) {
  /* eslint-disable global-require */
  Popup = require('./Popup').default;
  /* eslint-enable global-require */
}

function findDeparture(departures, message) {
  return (departures || []).find(
    item => item.pattern.code.split(':')[1] === message.route.split(':')[1],
  );
}

// if tripStartTime has been specified,
// use only the updates for vehicles with matching startTime
function shouldShowVehicle(message, pattern, tripStart, config) {
  const { direction, code, stops } = pattern;

  return (
    message.lat &&
    message.long &&
    code.split(':')[1] === message.route.split(':')[1] &&
    (direction === undefined || message.direction === direction) &&
    (tripStart === undefined || message.tripStartTime === tripStart) &&
    (stops === undefined ||
      stops
        .map(stop => stop.gtfsId)
        .includes(`${config.routePrefix}:${message.next_stop}`))
  );
}

function shouldShowVehicleAlt(message, departures, tripStart, config) {
  const departure = findDeparture(departures, message);

  if (!departure) {
    return false;
  }

  const { direction, stops } = departure.pattern;

  return (
    message.lat &&
    message.long &&
    (direction === undefined || message.direction === direction) &&
    (tripStart === undefined || message.tripStartTime === tripStart) &&
    (stops === undefined ||
      stops
        .map(stop => stop.gtfsId)
        .includes(`${config.routePrefix}:${message.next_stop}`))
  );
}

function VehicleMarkerContainer(props, { config }) {
  return Object.entries(props.vehicles)
    .filter(([, message]) => message.lat && message.long)
    .filter(([, message]) => {
      if (props.departures) {
        return shouldShowVehicleAlt(
          message,
          props.departures,
          props.tripStart,
          config,
        );
      }

      return shouldShowVehicle(message, props.pattern, props.tripStart, config);
    })
    .map(([id, message]) => {
      const departure = findDeparture(props.departures, message);
      const shortName = departure ? departure.shortName : props.shortName;

      return (
        <IconMarker
          key={id}
          position={{
            lat: message.lat,
            lon: message.long,
          }}
          icon={getVehicleIcon(
            message.mode,
            message.heading,
            shortName,
            props.className,
          )}
        >
          <Popup
            offset={[106, 16]}
            maxWidth={250}
            minWidth={250}
            className="popup"
          >
            <Relay.RootContainer
              Component={RouteMarkerPopup}
              route={
                new FuzzyTripRoute({
                  tripId: message.tripId,
                  route: message.route,
                  direction: message.direction,
                  date: message.operatingDay,
                  time:
                    message.tripStartTime.substring(0, 2) * 60 * 60 +
                    message.tripStartTime.substring(2, 4) * 60,
                })
              }
              renderLoading={() => (
                <div className="card" style={{ height: '12rem' }}>
                  <Loading />
                </div>
              )}
              renderFetched={data => (
                <RouteMarkerPopup {...data} message={message} />
              )}
            />
          </Popup>
        </IconMarker>
      );
    });
}

VehicleMarkerContainer.contextTypes = {
  config: PropTypes.object.isRequired,
};

VehicleMarkerContainer.propTypes = {
  tripStart: PropTypes.string,
  pattern: PropTypes.object,
  vehicles: PropTypes.objectOf(
    PropTypes.shape({
      direction: PropTypes.number,
      tripStartTime: PropTypes.string.isRequired,
      mode: PropTypes.string.isRequired,
      heading: PropTypes.number,
      lat: PropTypes.number,
      long: PropTypes.number,
    }).isRequired,
  ).isRequired,
  shortName: PropTypes.string,
  className: PropTypes.string,
  departures: PropTypes.array,
};

VehicleMarkerContainer.defaultProps = {
  tripStart: undefined,
  pattern: undefined,
  shortName: undefined,
  className: undefined,
  departures: undefined,
};

export default connectToStores(
  VehicleMarkerContainer,
  ['RealTimeInformationStore'],
  (context, props) => ({
    ...props,
    vehicles: context.getStore('RealTimeInformationStore').vehicles,
  }),
);
