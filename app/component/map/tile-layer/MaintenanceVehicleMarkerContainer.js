import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';

import IconWithTail from '../../IconWithTail';
import IconMarker from '../IconMarker';
import MaintenanceVehiclePopup from '../popups/MaintenanceVehiclePopup';

import { isBrowser } from '../../../util/browser';
import {
  startTail,
  endTail,
} from '../../../action/maintenanceVehicleTailActions';

let Popup;

function getMaintenanceVehicleIcon(className) {
  if (!isBrowser) {
    return null;
  }

  return {
    element: <IconWithTail img="icon-icon_maintenance-vehicle" />,
    className: `${className || 'vehicle-icon'}`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  };
}

if (isBrowser) {
  /* eslint-disable global-require */
  Popup = require('../Popup').default;
  /* eslint-enable global-require */
}

function MaintenanceVehicleMarkerContainer({
  className,
  maintenanceVehicles,
  startMaintenanceVehicleTail,
  endMaintenanceVehicleTail,
}) {
  return Object.entries(maintenanceVehicles)
    .filter(([, message]) => message.lat && message.long)
    .map(([id, message]) => {
      const onPopupOpen = () => {
        startMaintenanceVehicleTail(message.id);
      };
      const onPopupClose = () => {
        endMaintenanceVehicleTail();
      };

      return (
        <IconMarker
          icon={getMaintenanceVehicleIcon(className)}
          key={id}
          position={{
            lat: message.lat,
            lon: message.long,
          }}
        >
          <Popup
            offset={[106, 16]}
            maxWidth={250}
            minWidth={250}
            className="popup"
            onOpen={onPopupOpen}
            onClose={onPopupClose}
          >
            <MaintenanceVehiclePopup maintenanceVehicle={message} />
          </Popup>
        </IconMarker>
      );
    });
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
      jobIds: PropTypes.arrayOf(PropTypes.number),
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
    startMaintenanceVehicleTail: id => context.executeAction(startTail, id),
    endMaintenanceVehicleTail: () => context.executeAction(endTail),
  }),
  {
    executeAction: PropTypes.func,
  },
);
