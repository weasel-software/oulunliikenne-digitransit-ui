import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';

import IconWithTail from '../IconWithTail';
import IconMarker from './IconMarker';
import MaintenanceVehiclePopup from './popups/MaintenanceVehiclePopup';
import LatestMaintenanceVehicleObservationsRoute from '../../route/LatestMaintenanceVehicleObservationsRoute';
import Loading from '../Loading';

import { isBrowser } from '../../util/browser';

let Popup;

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

if (isBrowser) {
  /* eslint-disable global-require */
  Popup = require('./Popup').default;
  /* eslint-enable global-require */
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
      >
        <Popup
          offset={[106, 16]}
          maxWidth={250}
          minWidth={250}
          className="popup"
        >
          <Relay.RootContainer
            Component={MaintenanceVehiclePopup}
            forceFetch
            route={
              new LatestMaintenanceVehicleObservationsRoute({
                vehicleNumber: message.id,
              })
            }
            renderLoading={() => (
              <div className="card" style={{ height: '12rem' }}>
                <Loading />
              </div>
            )}
            renderFetched={data => (
              <MaintenanceVehiclePopup {...data} maintenanceVehicle={message} />
            )}
          />
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
  ['MaintenanceVehicleRealTimeInformationStore'],
  (context, props) => ({
    ...props,
    maintenanceVehicles: context.getStore(
      'MaintenanceVehicleRealTimeInformationStore',
    ).maintenanceVehicles,
  }),
);
