import Relay from 'react-relay/classic';

class EcoCounterDataRoute extends Relay.Route {
  static queries = {
    data: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('data', variables)}
        }
      }
    `,
  };
  static paramDefinitions = {
    domain: { required: true },
    id: { required: true },
    step: { required: false },
    begin: { required: false },
    end: { require: false },
  };
  static routeName = 'EcoCounterDataRoute';
}

export default EcoCounterDataRoute;
