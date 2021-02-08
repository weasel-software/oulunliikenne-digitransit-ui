import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getContext from 'recompose/getContext';
import PropTypes from 'prop-types';

import { MaintenanceJobColors } from '../constants';

const InspectionVehicleLegend = ({ mapLayers }) => {
  if (!mapLayers || !mapLayers.roadInspectionVehicles) {
    return null;
  }

  return (
    <div className="maintenance-vehicle-legend">
      <ul>
        <li>
          <div
            className="maintenance-vehicle-legend__color"
            style={{
              backgroundColor: MaintenanceJobColors['99902-car'],
            }}
          />
          <FormattedMessage id="maintenance-job-legend-99902-car" />
        </li>
        <li>
          <div
            className="maintenance-vehicle-legend__color"
            style={{
              backgroundColor: MaintenanceJobColors['99902-bicycle'],
            }}
          />
          <FormattedMessage id="maintenance-job-legend-99902-bicycle" />
        </li>
      </ul>
    </div>
  );
};

InspectionVehicleLegend.propTypes = {
  mapLayers: PropTypes.object,
};

export default connectToStores(
  getContext({
    getStore: PropTypes.func.isRequired,
  })(InspectionVehicleLegend),
  ['MapLayerStore'],
  ({ getStore }) => ({
    mapLayers: getStore('MapLayerStore').getMapLayers(),
  }),
);
