import Relay from 'react-relay/classic';

export default class WeatherStationRoute extends Relay.Route {
  static queries = {
    station: () => Relay.QL`
      query ($id: String!) {
        weatherStation(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'WeatherStationRoute';
}
