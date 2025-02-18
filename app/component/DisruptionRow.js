import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import RouteList from './RouteList';
import { PREFIX_STOPS } from '../util/path';

function DisruptionRow({
  routes,
  startTime,
  endTime,
  description,
  cause,
  stops,
}) {
  return (
    <div className="row">
      <section className="grid-content">
        <div className="disruption-header disruption">
          {routes.length > 0 && (
            <RouteList
              className="left"
              routes={routes.filter(route => route)}
            />
          )}
          {stops &&
            stops.map(stop => (
              <Link
                key={stop.gtfsId}
                to={`/${PREFIX_STOPS}/${encodeURIComponent(stop.gtfsId)}`}
              >
                <span className="stop-list left bold">{stop.name}</span>
              </Link>
            ))}
          <span className="time bold">
            {`${startTime.format('DD.MM.YYYY HH:mm')} - ${endTime.format(
              'DD.MM.YYYY HH:mm',
            )}`}
          </span>
        </div>
        <div className="disruption-content">
          <p>{description}</p>
        </div>
        {cause && (
          <div className="disruption-details hide">
            <span>
              <b className="uppercase">
                <FormattedMessage id="cause" defaultMessage="cause" />:
              </b>
              {cause}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

DisruptionRow.propTypes = {
  startTime: PropTypes.instanceOf(moment).isRequired,
  endTime: PropTypes.instanceOf(moment).isRequired,
  routes: PropTypes.arrayOf(PropTypes.object),
  description: PropTypes.node,
  cause: PropTypes.node,
  stops: PropTypes.arrayOf(PropTypes.object),
};

DisruptionRow.defaultProps = {
  routes: [],
  description: null,
  cause: null,
  stops: [],
};

export default DisruptionRow;
