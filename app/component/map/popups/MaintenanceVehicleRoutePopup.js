import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { FormattedMessage, intlShape } from 'react-intl';
import moment from 'moment';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';

function MaintenanceVehicleRoutePopup(
  { maintenanceVehicleRouteEvent },
  { intl },
) {
  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'maintenance',
            defaultMessage: 'Maintenance',
          })}
          description={intl.formatMessage({
            id: 'maintenance-job-realization',
          })}
          icon="icon-icon_maintenance-vehicle"
          unlinked
        />
        <FormattedMessage id="maintenance-job" defaultMessage="Maintenance job">
          {(...content) => `${content}:`}
        </FormattedMessage>
        <ul>
          {maintenanceVehicleRouteEvent.jobIds.map(jobId => (
            <li key={jobId}>
              <FormattedMessage id={`maintenance-job-${jobId}`} />
            </li>
          ))}
        </ul>
        <FormattedMessage id="last-updated" defaultMessage="Last updated">
          {(...content) => `${content} `}
        </FormattedMessage>
        {moment(maintenanceVehicleRouteEvent.measuredTime).format(
          'D.M.Y HH:mm:ss',
        ) || ''}
      </Card>
    </div>
  );
}

MaintenanceVehicleRoutePopup.displayName = 'MaintenanceVehicleRoutePopup';

MaintenanceVehicleRoutePopup.description = (
  <div>
    <p>Renders a maintenance vehicle route popup.</p>
    <ComponentUsageExample description="">
      <MaintenanceVehicleRoutePopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

MaintenanceVehicleRoutePopup.propTypes = {
  maintenanceVehicleRouteEvent: PropTypes.shape({
    id: PropTypes.string,
    routeEventId: PropTypes.string,
    routeType: PropTypes.string,
    measuredTime: PropTypes.string,
    contractId: PropTypes.number,
    jobIds: PropTypes.arrayOf(PropTypes.number),
    geojson: PropTypes.shape({
      type: PropTypes.string,
      geometry: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      }),
    }),
  }).isRequired,
};

MaintenanceVehicleRoutePopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(MaintenanceVehicleRoutePopup, {
  fragments: {
    maintenanceVehicleRouteEvent: () => Relay.QL`
      fragment on MaintenanceVehicleRouteEvent {
        id
        routeEventId
        routeType
        measuredTime
        contractId
        jobIds
        geojson
      }
    `,
  },
});
