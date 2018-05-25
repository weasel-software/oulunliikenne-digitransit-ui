import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

const noop = () => {};

export const mockContext = {
  getStore: () => ({
    on: noop,
    getLanguage: () => 'en',
    getLocationState: noop,
  }),
};

export const mockChildContextTypes = {
  executeAction: PropTypes.func,
  getStore: PropTypes.func,
  relay: PropTypes.object,
  route: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export const createMockContext = () => ({
  ...mockContext,
});

export const createRelayMockContext = (variables = {}) => ({
  ...createMockContext(),
  executeAction: noop,
  relay: {
    environment: {
      applyMutation: noop,
      sendMutation: noop,
      forceFetch: noop,
      getFragmentResolver: noop,
      getStoreData: noop,
      primeCache: noop,
    },
    variables: {
      ...variables,
    },
  },
  route: {
    name: 'mockRoute',
  },
});
