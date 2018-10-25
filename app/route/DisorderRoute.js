import Relay from 'react-relay/classic';

export default class DisordersRoute extends Relay.Route {
  static queries = {
    disorder: () => Relay.QL`
      query ($id: String!) {
        disorder(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'DisordersRoute';
}
