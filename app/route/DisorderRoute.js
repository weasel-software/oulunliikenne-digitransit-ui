import Relay from 'react-relay/classic';

export default class DisorderRoute extends Relay.Route {
  static queries = {
    trafficDisorder: () => Relay.QL`
      query ($id: String!) {
        trafficDisorder(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'DisorderRoute';
}
