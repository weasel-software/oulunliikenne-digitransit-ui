import Relay from 'react-relay/classic';

class EcoCounterComparisonDualChannelRoute extends Relay.Route {
  static queries = {
    range1channel1: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('range1channel1', variables)}
        }
      }
    `,
    range1channel2: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('range1channel2', variables)}
        }
      }
    `,
    range2channel1: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('range2channel1', variables)}
        }
      }
    `,
    range2channel2: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('range2channel2', variables)}
        }
      }
    `,
  };
  static paramDefinitions = {
    domain: { required: true },
    channel1Id: { required: true },
    channel2Id: { required: true },
    step: { required: false },
    range1begin: { required: false },
    range1end: { required: false },
    range2begin: { required: false },
    range2end: { required: false },
  };
  static routeName = 'EcoCounterComparisonDualChannelRoute';
}

export default EcoCounterComparisonDualChannelRoute;
