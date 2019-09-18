import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';

import IconWithTail from '../IconWithTail';
import IconMarker from './IconMarker';

import { isBrowser } from '../../util/browser';

function getMaintenanceVehicleIcon(className) {
  if (!isBrowser) {
    return null;
  }

  return {
    element: (
      <IconWithTail img="icon-icon_bus_text-live">
        <text x="50%" y="50%" dy=".3em" className="icon-text medium">
          MV
        </text>
      </IconWithTail>
    ),
    className: `${className || 'vehicle-icon'}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  };
}

function MaintenanceVehicleMarkerContainer({ className, maintenanceVehicles }) {
  return Object.entries(maintenanceVehicles)
    .filter(([, message]) => message.lat && message.long)
    .map(([id, message]) => (
      <IconMarker
        key={id}
        position={{
          lat: message.lat,
          lon: message.long,
        }}
        icon={getMaintenanceVehicleIcon(className)}
      />
    ));
}

MaintenanceVehicleMarkerContainer.contextTypes = {
  config: PropTypes.object.isRequired,
};

MaintenanceVehicleMarkerContainer.propTypes = {
  maintenanceVehicles: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      long: PropTypes.number,
    }).isRequired,
  ).isRequired,
  className: PropTypes.string,
};

MaintenanceVehicleMarkerContainer.defaultProps = {
  className: undefined,
};

export default connectToStores(
  MaintenanceVehicleMarkerContainer,
  ['MaintenanceVehicleRealTimeInformationStore'],
  (context, props) => ({
    ...props,
    maintenanceVehicles: context.getStore(
      'MaintenanceVehicleRealTimeInformationStore',
    ).maintenanceVehicles,
  }),
);
