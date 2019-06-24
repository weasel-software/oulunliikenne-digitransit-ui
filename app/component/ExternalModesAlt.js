import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { routerShape, locationShape } from 'react-router';
import { intlShape } from 'react-intl';

import ExternalModesContent from './ExternalModesContent';
import ComponentUsageExample from './ComponentUsageExample';
import { isBrowser } from '../util/browser';
import Modal from './Modal';

const ExternalModesAlt = (props, { router, location, intl }) => {
  if (!((props && props.isBrowser) || isBrowser)) {
    return null;
  }

  const isOpen = () =>
    location.state ? location.state.externalModesOpen : false;

  if (!isOpen()) {
    return null;
  }

  const toggleVisibility = () => {
    if (isOpen()) {
      router.goBack();
    } else {
      router.push({
        ...location,
        state: {
          ...location.state,
          externalModesOpen: true,
        },
      });
    }
  };

  return (
    <Modal
      open
      title={intl.formatMessage({
        id: 'external-modes',
        defaultMessage: 'Other transportation',
      })}
      toggleVisibility={toggleVisibility}
    >
      <Relay.RootContainer
        Component={ExternalModesContent}
        route={{
          name: 'ExternalModesRoute',
          queries: {
            root: Component => Relay.QL`
                query {
                  viewer {
                    ${Component.getFragment('root')}
                  }
                }
             `,
          },
          params: {},
        }}
      />
    </Modal>
  );
};

ExternalModesAlt.propTypes = {
  isBrowser: PropTypes.bool,
};

ExternalModesAlt.defaultProps = {
  isBrowser: false,
};

ExternalModesAlt.contextTypes = {
  router: routerShape.isRequired, // eslint-disable-line react/no-typos
  location: locationShape.isRequired, // eslint-disable-line react/no-typos
  intl: intlShape.isRequired,
};

ExternalModesAlt.description = (
  <ComponentUsageExample isFullscreen>
    <div style={{ bottom: 0, left: 0, position: 'absolute' }}>
      <ExternalModesAlt />
    </div>
  </ComponentUsageExample>
);

export default ExternalModesAlt;
