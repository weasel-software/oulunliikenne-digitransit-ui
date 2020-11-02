import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getContext from 'recompose/getContext';
import PropTypes from 'prop-types';

import { MaintenanceJobColors, MaintenanceJobLegendIds } from '../constants';

const MaintenanceVehicleLegend = ({ mapLayers }) => {
  if (!mapLayers || !mapLayers.maintenanceVehicles) {
    return null;
  }

  return (
    <div className="maintenance-vehicle-legend">
      <ul>
        {MaintenanceJobLegendIds.map(jobId => (
          <li key={jobId}>
            <div
              className="maintenance-vehicle-legend__color"
              style={{
                backgroundColor: MaintenanceJobColors[jobId],
              }}
            />
            <FormattedMessage id={`maintenance-job-legend-${jobId}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

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
