import Relay from 'react-relay/classic';

export default class ParkingStationRoute extends Relay.Route {
  static queries = {
    station: () => Relay.QL`
      query ($id: String!) {
        carPark(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'ParkingStationRoute';
}
