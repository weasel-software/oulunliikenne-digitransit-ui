import Relay from 'react-relay/classic';

export default class MaintenanceVehicleRouteRoute extends Relay.Route {
  static queries = {
    maintenanceVehicleRouteEvent: () => Relay.QL`
      query ($id: String!) {
        maintenanceVehicleRouteEvent(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'MaintenanceVehicleRouteRoute';
}
