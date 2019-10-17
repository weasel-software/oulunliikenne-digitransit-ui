import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getContext from 'recompose/getContext';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MaintenanceJobColors } from '../constants';

const MaintenanceVehicleLegend = ({ mapLayers }) => (
  <div
    className={classNames('maintenance-vehicle-legend', {
      'maintenance-vehicle-legend--hidden': !mapLayers.maintenanceVehicles,
    })}
  >
    <ul>
      {Object.keys(MaintenanceJobColors).map(jobId => (
        <li key={jobId}>
          <div
            className="maintenance-vehicle-legend__color"
            style={{
              backgroundColor: MaintenanceJobColors[jobId],
            }}
          />
          <FormattedMessage id={`maintenance-job-${jobId}`} />
        </li>
      ))}
    </ul>
  </div>
);

MaintenanceVehicleLegend.propTypes = {
  mapLayers: PropTypes.object,
};

export default connectToStores(
  getContext({
    getStore: PropTypes.func.isRequired,
  })(MaintenanceVehicleLegend),
  ['MapLayerStore'],
  ({ getStore }) => ({
    mapLayers: getStore('MapLayerStore').getMapLayers(),
  }),
);
