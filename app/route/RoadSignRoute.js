import Relay from 'react-relay/classic';

export default class RoadSignRoute extends Relay.Route {
  static queries = {
    roadSign: () => Relay.QL`
      query ($id: String!) {
        variableRoadSign(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'RoadSignRoute';
}
