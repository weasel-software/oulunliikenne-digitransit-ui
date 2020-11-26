import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';

import IconWithTail from '../../IconWithTail';
import IconMarker from '../IconMarker';
import MaintenanceVehiclePopup from '../popups/MaintenanceVehiclePopup';

import { isBrowser } from '../../../util/browser';
import { isLayerEnabled } from '../../../util/mapLayerUtils';
import { RoadInspectionJobId } from '../../../constants';

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
  mapLayers,
}) {
  const showOnlyInspectionJobs = isLayerEnabled(
    'roadInspectionVehicles',
    mapLayers,
  );
  return Object.entries(maintenanceVehicles)
    .filter(
      ([, message]) =>
        showOnlyInspectionJobs
          ? message.jobIds.includes(RoadInspectionJobId)
          : true,
    )
    .filter(([, message]) => message.lat && message.long)
    .map(([id, message]) => (
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
        >
          <MaintenanceVehiclePopup maintenanceVehicle={message} />
        </Popup>
      </IconMarker>
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
  ['MaintenanceVehicleRealTimeInformationStore', 'MapLayerStore'],
  (context, props) => ({
    ...props,
    maintenanceVehicles: context.getStore(
      'MaintenanceVehicleRealTimeInformationStore',
    ).maintenanceVehicles,
    mapLayers: context.getStore('MapLayerStore').mapLayers,
  }),
  {
    executeAction: PropTypes.func,
  },
);
