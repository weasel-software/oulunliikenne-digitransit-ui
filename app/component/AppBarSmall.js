import PropTypes from 'prop-types';
import React from 'react';

import BackButton from './BackButton';
import DisruptionInfo from './DisruptionInfo';
import NavbarLinks from './NavbarLinks';
import ExternalModesAlt from './ExternalModesAlt';
import MainMenuContainer from './MainMenuContainer';
import ComponentUsageExample from './ComponentUsageExample';
import MessageBar from './MessageBar';
import LogoSmall from './LogoSmall';

const AppBarSmall = ({ disableBackButton, showLogo, title, homeUrl, logo }) => (
  <React.Fragment>
    <DisruptionInfo />
    <NavbarLinks />
    <ExternalModesAlt />
    <nav className="top-bar">
      {!disableBackButton && <BackButton />}
      <section className="title">
        <h1>
          <LogoSmall showLogo={showLogo} logo={logo} title={title} />
        </h1>
      </section>
      <MainMenuContainer homeUrl={homeUrl} />
    </nav>
    <MessageBar />
  </React.Fragment>
);

AppBarSmall.displayName = 'AppBarSmall';

AppBarSmall.description = () => (
  <div>
    <p>AppBar of application for small display</p>
    <ComponentUsageExample description="">
      <AppBarSmall title="Reittiopas.hsl.fi" className="fullscreen" />
    </ComponentUsageExample>
    <ComponentUsageExample description="no back button">
      <AppBarSmall
        disableBackButton
        title="Reittiopas.hsl.fi"
        className="fullscreen"
      />
    </ComponentUsageExample>
  </div>
);

AppBarSmall.propTypes = {
  disableBackButton: PropTypes.bool,
  showLogo: PropTypes.bool,
  title: PropTypes.node,
  homeUrl: PropTypes.string,
  logo: PropTypes.string,
};

export default AppBarSmall;
