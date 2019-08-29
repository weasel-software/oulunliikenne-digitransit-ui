import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Link, routerShape, locationShape } from 'react-router';

import DisruptionInfoButtonContainer from './DisruptionInfoButtonContainer';
import Icon from './Icon';
import LangSelect from './LangSelect';
import MainMenuLinks from './MainMenuLinks';

function MainMenu(props, { config, intl, router, location }) {
  const openNavbarLinks = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        navbarLinksOpen: true,
      },
    });
  };

  const openExternalModes = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        externalModesOpen: true,
      },
    });
  };

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <div aria-hidden={!props.visible} className="main-menu no-select">
      <button
        onClick={props.toggleVisibility}
        className="close-button cursor-pointer"
        aria-label={intl.formatMessage({
          id: 'main-menu-label-close',
          defaultMessage: 'Close the main menu',
        })}
      >
        <Icon img="icon-icon_close" className="medium" />
      </button>
      <header className="offcanvas-section">
        <LangSelect />
      </header>
      <div className="offcanvas-section">
        <Link id="frontpage" to={props.homeUrl}>
          <FormattedMessage id="frontpage" defaultMessage="Frontpage" />
        </Link>
      </div>
      {config.mainMenu.showDisruptions &&
        props.showDisruptionInfo && (
          <div className="offcanvas-section">
            <DisruptionInfoButtonContainer />
          </div>
        )}
      <div className="offcanvas-section">
        <button
          className="noborder button cursor-pointer"
          onClick={openExternalModes}
          aria-label={intl.formatMessage({
            id: 'external-modes',
            defaultMessage: 'Other transportation',
          })}
        >
          <FormattedMessage
            id="external-modes"
            defaultMessage="Other transportation"
          />
        </button>
      </div>
      <div className="offcanvas-section">
        <button
          className="noborder button cursor-pointer"
          onClick={openNavbarLinks}
          aria-label={intl.formatMessage({
            id: 'links',
            defaultMessage: 'Links',
          })}
        >
          <FormattedMessage id="links" defaultMessage="Links" />
        </button>
      </div>
      <MainMenuLinks
        content={(
          [config.appBarLink].concat(config.footer && config.footer.content) ||
          []
        ).filter(item => item.href || item.route)}
      />
    </div>
  );
}

MainMenu.propTypes = {
  showDisruptionInfo: PropTypes.bool,
  toggleVisibility: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  homeUrl: PropTypes.string.isRequired,
};

MainMenu.defaultProps = {
  visible: true,
};

MainMenu.contextTypes = {
  getStore: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};

export default MainMenu;
