import Relay from 'react-relay/classic';

export default class LatestMaintenanceVehicleObservationsRoute extends Relay.Route {
  static queries = {
    observations: (Component, variables) => Relay.QL`
      query {
        viewer {
          ${Component.getFragment('observations', variables)}
        }
      }
    `,
  };
  static paramDefinitions = {
    vehicleNumber: { required: true },
  };
  static routeName = 'LatestMaintenanceVehicleObservationsRoute';
}
