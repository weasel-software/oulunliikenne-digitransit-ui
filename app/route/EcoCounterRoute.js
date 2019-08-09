import Relay from 'react-relay/classic';

export default class EcoCounterRoute extends Relay.Route {
  static queries = {
    site: (Component, variables) => Relay.QL`
      query {
        viewer {        
          ${Component.getFragment('site', {
            id: variables.id,
            domain: variables.domain,
          })}
        }
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
    domain: { required: true },
  };
  static routeName = 'EcoCounterRoute';
}
