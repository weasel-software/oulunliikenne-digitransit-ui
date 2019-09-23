import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { FormattedMessage, intlShape } from 'react-intl';
import moment from 'moment';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import { sortByPriority } from '../../../util/maintenanceUtils';

const MaintenanceVehiclePopup = ({ maintenanceVehicle }, { intl }) => (
  <div className="card">
    <Card className="padding-small">
      <CardHeader
        name={intl.formatMessage({
          id: 'maintenance',
          defaultMessage: 'Maintenance',
        })}
        description={intl.formatMessage(
          { id: 'maintenance-vehicle-name' },
          { vehicleNumber: maintenanceVehicle.id },
        )}
        unlinked
      />
      <FormattedMessage id="maintenance-job" defaultMessage="Maintenance job">
        {(...content) => `${content}:`}
      </FormattedMessage>
      <ul>
        {sortByPriority(maintenanceVehicle.jobIds).map(jobId => (
          <li key={jobId}>
            <FormattedMessage id={`maintenance-job-${jobId}`} />
          </li>
        ))}
      </ul>
      <FormattedMessage id="last-updated" defaultMessage="Last updated">
        {(...content) => `${content} `}
      </FormattedMessage>
      {moment.unix(maintenanceVehicle.timestamp).format('HH:mm:ss') || ''}
    </Card>
  </div>
);

MaintenanceVehiclePopup.displayName = 'MaintenanceVehiclePopup';

MaintenanceVehiclePopup.description = (
  <div>
    <p>Renders a maintenance vehicle popup.</p>
    <ComponentUsageExample description="">
      <MaintenanceVehiclePopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

MaintenanceVehiclePopup.propTypes = {
  maintenanceVehicle: PropTypes.shape({
    id: PropTypes.number,
    jobIds: PropTypes.arrayOf(PropTypes.number),
    timestamp: PropTypes.number,
    lat: PropTypes.number,
    long: PropTypes.number,
    dir: PropTypes.number,
  }),
  observations: PropTypes.shape({
    latestMaintenanceVehicleObservations: PropTypes.arrayOf(
      PropTypes.shape({
        vehicleNumber: PropTypes.number,
        vehicleType: PropTypes.string,
        timestamp: PropTypes.string,
        direction: PropTypes.number,
        contractId: PropTypes.number,
        jobIds: PropTypes.arrayOf(PropTypes.number),
        lat: PropTypes.number,
        lon: PropTypes.number,
      }),
    ),
  }),
};

MaintenanceVehiclePopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(MaintenanceVehiclePopup, {
  fragments: {
    observations: () => Relay.QL`
      fragment on Query {
        latestMaintenanceVehicleObservations(vehicleNumber: $vehicleNumber) {
          vehicleNumber
          vehicleType
          timestamp
          direction
          contractId
          jobIds
          lat
          lon
        }
      }
    `,
  },
  initialVariables: {
    vehicleNumber: null,
  },
});
