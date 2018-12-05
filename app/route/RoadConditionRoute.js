import Relay from 'react-relay/classic';

export default class RoadConditionRoute extends Relay.Route {
  static queries = {
    station: () => Relay.QL`
      query ($id: String!) {
        roadCondition(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'RoadConditionRoute';
}
