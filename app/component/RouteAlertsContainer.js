import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { FormattedMessage, intlShape } from 'react-intl';
import moment from 'moment';
import upperFirst from 'lodash/upperFirst';
import connectToStores from 'fluxible-addons-react/connectToStores';

import RouteAlertsRow from './RouteAlertsRow';

const getAlerts = (route, currentTime, intl) => {
  const routeMode = route.mode.toLowerCase();
  const routeLine = route.shortName;
  const { color } = route;

  return route.alerts.map(alert => {
    const header = alert.alertHeaderText;
    const description = alert.alertDescriptionText;

    const startTime = moment(alert.effectiveStartDate * 1000);
    const endTime = moment(alert.effectiveEndDate * 1000);
    const sameDay = startTime.isSame(endTime, 'day');

    return (
      <RouteAlertsRow
        key={alert.id}
        routeMode={routeMode}
        color={color ? `#${color}` : null}
        routeLine={routeLine}
        header={header}
        description={description}
        endTime={
          sameDay
            ? intl.formatTime(endTime)
            : upperFirst(endTime.calendar(currentTime))
        }
        startTime={upperFirst(startTime.calendar(currentTime))}
        expired={startTime > currentTime || currentTime > endTime}
      />
    );
  });
};

function RouteAlertsContainer({ route, currentTime }, { intl }) {
  if (route.alerts.length === 0) {
    return (
      <div className="no-alerts-message">
        <FormattedMessage
          id="disruption-info-route-no-alerts"
          defaultMessage="No known disruptions or diversions for route."
        />
      </div>
    );
  }

  return (
    <div className="route-alerts-list momentum-scroll">
      {getAlerts(route, currentTime, intl)}
    </div>
  );
}

RouteAlertsContainer.propTypes = {
  route: PropTypes.object.isRequired,
  currentTime: PropTypes.object,
};

RouteAlertsContainer.contextTypes = {
  intl: intlShape,
};

const RouteAlertsContainerWithTime = connectToStores(
  RouteAlertsContainer,
  ['TimeStore'],
  context => ({
    currentTime: context.getStore('TimeStore').getCurrentTime(),
  }),
);

export default Relay.createContainer(RouteAlertsContainerWithTime, {
  fragments: {
    route: () => Relay.QL`
        fragment on Route {
          mode
          color
          shortName
          alerts {
            id
            alertHeaderText(language: $language)
            alertDescriptionText(language: $language)
            effectiveStartDate
            effectiveEndDate
          }
        }
      `,
  },
  initialVariables: { language: null }, // todo: get user language
});
