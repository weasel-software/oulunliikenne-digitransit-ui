import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import RouteList from './RouteList';

function DisruptionRow({
  routes,
  startTime,
  endTime,
  description,
  cause,
  stop,
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
          {stop && <span className="bold">{stop.name}</span>}
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
  stop: PropTypes.object,
};

DisruptionRow.defaultProps = {
  routes: [],
  description: null,
  cause: null,
  stop: null,
};

export default DisruptionRow;
