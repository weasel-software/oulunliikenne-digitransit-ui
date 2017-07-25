import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';
import StopCardHeader from './StopCardHeader';

export default createFragmentContainer(StopCardHeader, {
  stop: graphql`
    fragment StopCardHeaderContainer_stop on Stop {
      gtfsId
      name
      code
      desc
    }
  `,
});
