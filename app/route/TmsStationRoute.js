import Relay from 'react-relay/classic';

export default class TmsStationRoute extends Relay.Route {
  static queries = {
    station: () => Relay.QL`
      query ($id: String!) {
        tmsStation(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'TmsStationRoute';
}
