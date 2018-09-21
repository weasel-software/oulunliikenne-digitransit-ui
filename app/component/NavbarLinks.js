import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import Modal from './Modal';
import ComponentUsageExample from './ComponentUsageExample';
import { isBrowser } from '../util/browser';
import connectToStores from 'fluxible-addons-react/connectToStores';

function NavbarLinks(props, context) {
  if (!((props && props.isBrowser) || isBrowser)) {
    return null;
  }

  if (!context.config.appBarLinks || !context.config.appBarLinks[props.currentLanguage]) {
    return null;
  }

  const isOpen = () =>
    context.location.state ? context.location.state.navbarLinksOpen : false;
  if (!isOpen()) {
    return null;
  }

  const toggleVisibility = () => {
    if (isOpen()) {
      context.router.goBack();
    } else {
      context.router.push({
        ...context.location,
        state: {
          ...context.location.state,
          navbarLinksOpen: true,
        },
      });
    }
  };

  const text = context.config.appBarLinks[props.currentLanguage].text;
  const links = context.config.appBarLinks[props.currentLanguage].links;

  return (
    <Modal
      open
      title={
        <FormattedMessage
          id="links"
          defaultMessage="Links"
        />
      }
      toggleVisibility={toggleVisibility}
    >
      {text && (
        <p>{text}</p>
      )}

      {links && (
        <ul className="navbar-links-list">
          {links.map((link, key) => <li key={key}><a href={link.href}>{link.name}</a></li>)}
        </ul>
      )}
    </Modal>
  );
}

NavbarLinks.contextTypes = {
  router: routerShape.isRequired, // eslint-disable-line react/no-typos
  location: locationShape.isRequired, // eslint-disable-line react/no-typos
  config: PropTypes.object.isRequired,
};

NavbarLinks.propTypes = {
  isBrowser: PropTypes.bool,
  currentLanguage: PropTypes.string,
};

NavbarLinks.defaultProps = {
  isBrowser: false,
};

NavbarLinks.description = () => (
  <div>
    <p>
      Modal that shows links defined in config.
    </p>
    <ComponentUsageExample>
      <NavbarLinks />
    </ComponentUsageExample>
  </div>
);

export default connectToStores(NavbarLinks, ['PreferencesStore'], context => ({
  currentLanguage: context.getStore('PreferencesStore').getLanguage(),
}));
