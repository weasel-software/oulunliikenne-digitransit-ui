import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';

import ComponentUsageExample from './ComponentUsageExample';
import { isBrowser } from '../util/browser';
import NavbarLinksContent from './NavbarLinksContent';

function NavbarLinks(props) {
  if (!((props && props.isBrowser) || isBrowser)) {
    return null;
  }

  return (
    <Relay.RootContainer
      Component={NavbarLinksContent}
      route={{
        name: 'NavbarLinksRoute',
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
  );
}

NavbarLinks.propTypes = {
  isBrowser: PropTypes.bool,
};

NavbarLinks.defaultProps = {
  isBrowser: false,
};

NavbarLinks.description = () => (
  <div>
    <p>Modal that shows links.</p>
    <ComponentUsageExample>
      <NavbarLinks />
    </ComponentUsageExample>
  </div>
);

export default NavbarLinks;
