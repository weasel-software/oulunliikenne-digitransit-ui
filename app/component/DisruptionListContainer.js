import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import DisruptionRow from './DisruptionRow';

function DisruptionListContainer({ root }) {
  if (!root || !root.alerts || root.alerts.length === 0) {
    return (
      <FormattedMessage
        id="disruption-info-no-alerts"
        defaultMessage="No known disruptions or diversions."
      />
    );
  }

  const alertElements = root.alerts.map(alert => {
    const { id } = alert;
    const startTime = moment(alert.effectiveStartDate * 1000);
    const endTime = moment(alert.effectiveEndDate * 1000);
    const routes = alert.entities
      ? alert.entities.filter(entity => entity.shortName)
      : undefined;
    const stops = alert.entities
      ? alert.entities.filter(entity => entity.gtfsId)
      : undefined;
    const description = alert.alertDescriptionText;

    return (
      <DisruptionRow
        key={id}
        description={description}
        startTime={startTime}
        endTime={endTime}
        routes={routes}
        stops={stops}
      />
    );
  });

  return <div className="disruption-list">{alertElements}</div>;
}

DisruptionListContainer.contextTypes = {};

DisruptionListContainer.propTypes = {
  root: PropTypes.shape({
    alerts: PropTypes.array,
  }).isRequired,
};

export default Relay.createContainer(DisruptionListContainer, {
  fragments: {
    root: () => Relay.QL`
        fragment on Query {
            alerts(feeds:$feedIds) {
                id
                feed
                alertHeaderText(language: $language)
                alertDescriptionText(language: $language)
                effectiveStartDate
                effectiveEndDate
                entities {
                    ... on Route {
                        shortName
                        mode
                    }
                    ... on Stop {
                        id
                        name
                        gtfsId
                    }
                }
            }
        }
    `,
  },
  initialVariables: {
    feedIds: null,
    language: null,
  },
});
