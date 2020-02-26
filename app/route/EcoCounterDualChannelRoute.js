import Relay from 'react-relay/classic';

class EcoCounterDualChannelRoute extends Relay.Route {
  static queries = {
    channel1: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('channel1', variables)}
        }
      }
    `,
    channel2: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('channel2', variables)}
        }
      }
    `,
  };
  static paramDefinitions = {
    domain: { required: true },
    channel1Id: { required: true },
    channel2Id: { required: true },
    step: { required: false },
    begin: { required: false },
    end: { required: false },
  };
  static routeName = 'EcoCounterDualChannelRoute';
}

export default EcoCounterDualChannelRoute;
