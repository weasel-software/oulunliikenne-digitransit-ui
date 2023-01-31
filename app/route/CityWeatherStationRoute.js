import Relay from 'react-relay/classic';

export default class CityWeatherStationRoute extends Relay.Route {
  static queries = {
    station: () => Relay.QL`
      query ($id: String!) {
        cityWeatherStation(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'CityWeatherStationRoute';
}
