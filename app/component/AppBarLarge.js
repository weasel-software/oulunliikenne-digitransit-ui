import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import ExternalLink from './ExternalLink';
import DisruptionInfo from './DisruptionInfo';
import NavbarLinks from './NavbarLinks';
import MoreInfoModal from './MoreInfoModal';
import Icon from './Icon';
import ComponentUsageExample from './ComponentUsageExample';
import LangSelect from './LangSelect';
import ModeSelect from './ModeSelect';
import ExternalModes from './ExternalModes';
import SelectMapLayersDialog from './SelectMapLayersDialog';
import MessageBar from './MessageBar';
import { isBrowser } from '../util/browser';
import {
  getStreetMode,
  setStreetMode,
  getAvailableStreetModeConfigs,
} from '../util/modeUtils';
import { updateMapLayersMode } from '../action/MapLayerActions';
import { clearDepartures } from '../action/RealtimeDeparturesActions';

const AppBarLarge = (
  { titleClicked, logo },
  { router, location, config, intl, executeAction },
) => {
  const openDisruptionInfo = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        disruptionInfoOpen: true,
      },
    });
  };

  const openNavbarLinks = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        navbarLinksOpen: true,
      },
    });
  };

  let logoElement;

  if (config.textLogo) {
    logoElement = (
      <section className="title">
        <span className="title">{config.title}</span>
      </section>
    );
  } else if (isBrowser && logo) {
    logoElement = (
      <div className="navi-logo" style={{ backgroundImage: `url(${logo})` }} />
    );
  } else {
    logoElement = (
      <div className="navi-logo" style={{ backgroundImage: 'none' }} />
    );
  }

  const frontPageTitle = intl.formatMessage({
    id: 'frontpage',
    defaultMessage: 'Front page',
  });

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid */
  return (
    <div>
      <header className="top-bar bp-large flex-horizontal">
        <nav className="top-bar flex-grow flex-horizontal">
          <button
            className="noborder"
            onClick={titleClicked}
            aria-label={frontPageTitle}
            title={frontPageTitle}
          >
            <h1 className="no-margin">{logoElement}</h1>
          </button>
          {config.availableModes && (
            <div className="navi-modes padding-left-large">
              <ModeSelect
                selectedStreetMode={getStreetMode(router.location, config)}
                selectStreetMode={(streetMode, isExclusive) => {
                  setStreetMode(streetMode, config, router, isExclusive);
                  executeAction(updateMapLayersMode, streetMode);
                  executeAction(clearDepartures);
                }}
                streetModeConfigs={getAvailableStreetModeConfigs(config)}
              />
            </div>
          )}

          {config.appBarExternalModes && (
            <div className="navi-buttons-more">
              <ExternalModes />
            </div>
          )}

          <div className="empty-space flex-grow" />

          {config.mapTrackingButtons &&
            config.mapTrackingButtons.altPosition && (
              <div className="navi-buttons right-border navi-margin">
                <SelectMapLayersDialog />
              </div>
            )}
          <div className="navi-languages right-border navi-margin">
            <LangSelect />
          </div>
          {config.appBarDisruptionInfo && (
            <div className="navi-icons navi-margin">
              <a
                className="noborder"
                onClick={openDisruptionInfo}
                aria-label={intl.formatMessage({
                  id: 'disruptions',
                  defaultMessage: 'Disruptions',
                })}
              >
                <Icon img="icon-icon_caution" pointerEvents />
              </a>
            </div>
          )}
          {config.appBarLinks && (
            <div className="navi-buttons navi-margin">
              <button
                className="navi-button"
                onClick={openNavbarLinks}
                aria-label={intl.formatMessage({
                  id: 'links',
                  defaultMessage: 'Links',
                })}
              >
                <FormattedMessage id="links" defaultMessage="Links" />
              </button>
            </div>
          )}
          {config.appBarLink && (
            <div className="padding-left-large navi-margin">
              <ExternalLink
                className="external-top-bar"
                {...config.appBarLink}
              />
            </div>
          )}
        </nav>
      </header>

      <MessageBar />
      <DisruptionInfo />
      <NavbarLinks />
      <MoreInfoModal />
    </div>
  );
};

AppBarLarge.propTypes = {
  titleClicked: PropTypes.func.isRequired,
  logo: PropTypes.string,
};

AppBarLarge.defaultProps = {
  logo: undefined,
};

AppBarLarge.displayName = 'AppBarLarge';

AppBarLarge.contextTypes = {
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  executeAction: PropTypes.func.isRequired,
};

AppBarLarge.description = () => (
  <div>
    <p>AppBar of application for large display</p>
    <ComponentUsageExample description="">
      <AppBarLarge titleClicked={() => {}} />
    </ComponentUsageExample>
  </div>
);

export default AppBarLarge;
