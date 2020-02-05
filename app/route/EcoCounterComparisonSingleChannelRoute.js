import Relay from 'react-relay/classic';

class EcoCounterComparisonSingleChannelRoute extends Relay.Route {
  static queries = {
    range1channel1: (RelayComponent, variables) => Relay.QL`
      query {
        viewer {
          ${RelayComponent.getFragment('range1channel1', variables)}
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
  };
  static paramDefinitions = {
    domain: { required: true },
    channel1Id: { required: true },
    step: { required: false },
    range1begin: { required: false },
    range1end: { required: false },
    range2begin: { required: false },
    range2end: { required: false },
  };
  static routeName = 'EcoCounterComparisonSingleChannelRoute';
}

export default EcoCounterComparisonSingleChannelRoute;
