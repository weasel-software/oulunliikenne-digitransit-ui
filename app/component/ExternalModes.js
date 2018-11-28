import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';

import ExternalModesContent from './ExternalModesContent';
import BubbleDialog from './BubbleDialog';
import ComponentUsageExample from './ComponentUsageExample';

const ExternalModes = ({ isOpen }) => (
  <BubbleDialog
    containerClassName="bubble-dialog-component-container-alt"
    header="external-modes"
    id="externalModes"
    icon="more"
    isOpen={isOpen}
    isFullscreenOnMobile
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
  </BubbleDialog>
);

ExternalModes.propTypes = {
  isOpen: PropTypes.bool,
};

ExternalModes.defaultProps = {
  isOpen: false,
};

ExternalModes.description = (
  <ComponentUsageExample isFullscreen>
    <div style={{ bottom: 0, left: 0, position: 'absolute' }}>
      <ExternalModes isOpen />
    </div>
  </ComponentUsageExample>
);

export default ExternalModes;
