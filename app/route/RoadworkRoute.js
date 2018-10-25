import Relay from 'react-relay/classic';

export default class RoadworkRoute extends Relay.Route {
  static queries = {
    roadwork: () => Relay.QL`
      query ($id: String!) {
        roadwork(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'RoadworkRoute';
}
