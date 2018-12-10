import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { Link } from 'react-router';
import cx from 'classnames';
import IconWithTail from './IconWithTail';
import SelectedIconWithTail from './SelectedIconWithTail';
import { PREFIX_ROUTES } from '../util/path';

function TripLink(props) {
  const imgName = `icon-icon_${props.mode}-live`;
  const icon = (props.selected && <SelectedIconWithTail img={imgName} />) || (
    <IconWithTail
      desaturate={props.selected === false}
      className={cx(props.mode, 'tail-icon')}
      img={imgName}
      rotate={180}
    />
  );

  if (props.trip.trip) {
    return (
      <Link
        to={`/${PREFIX_ROUTES}/${props.trip.trip.route.gtfsId}/pysakit/${
          props.trip.trip.pattern.code
        }/${props.trip.trip.gtfsId}`}
        className="route-now-content"
      >
        {icon}
      </Link>
    );
  }

  console.warn('Unable to match trip', props);
  return <span className="route-now-content">{icon}</span>;
}

TripLink.propTypes = {
  trip: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

TripLink.defaultProps = {
  selected: undefined,
};

export default Relay.createContainer(TripLink, {
  fragments: {
    trip: () => Relay.QL`
      fragment on Query {
        trip: trip(id: $tripId) {
          gtfsId
          pattern {
            code
          }
          route {
            gtfsId
          }
        }
      }
    `,
  },
  initialVariables: {
    tripId: null,
  },
});
