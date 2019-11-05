import * as React from 'react';
import forEach from 'lodash/forEach';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getContext from 'recompose/getContext';
import PropTypes from 'prop-types';

import { sortByPriority } from '../util/maintenanceUtils';
import { MaintenanceJobColors } from '../constants';

const getItems = () => {
  const items = {};

  forEach(MaintenanceJobColors, (color, jobId) => {
    if (!items[color]) {
      items[color] = jobId;
    }
  });

  return sortByPriority(Object.values(items));
};

const MaintenanceVehicleLegend = ({ mapLayers }) => {
  if (!mapLayers || !mapLayers.maintenanceVehicles) {
    return <div className="maintenance-vehicle-legend" />;
  }

  return (
    <div className="maintenance-vehicle-legend">
      <ul>
        {getItems().map(jobId => (
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
