import Relay from 'react-relay/classic';

export default class EcoCounterRoute extends Relay.Route {
  static queries = {
    sites: () => Relay.QL`
      query($ids: [String]) {
        ecoCounterSites(ids: $ids)
      }
    `,
  };
  static paramDefinitions = {
    ids: { required: true },
  };
  static routeName = 'EcoCounterRoute';
}
