import Relay from 'react-relay/classic';

class EcoCounterSingleChannelRoute extends Relay.Route {
  static queries = {
    channel1: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('channel1', variables)}
        }
      }
    `,
  };
  static paramDefinitions = {
    domain: { required: true },
    channel1Id: { required: true },
    step: { required: false },
    begin: { required: false },
    end: { required: false },
  };
  static routeName = 'EcoCounterSingleChannelRoute';
}

export default EcoCounterSingleChannelRoute;
