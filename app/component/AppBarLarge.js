import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';

import { routerShape, locationShape, Link } from 'react-router';

import styled from 'styled-components';

import Menu, { MenuItem } from 'hsl-shared-components/lib/Menu';
import { NavItem, NavDesktop } from 'hsl-shared-components/lib/Nav';
import DropdownMenu from 'hsl-shared-components/lib/DropdownMenu';

import Icons from 'hsl-shared-components/lib/Icons';
import IconWithText from 'hsl-shared-components/lib/IconWithText/IconWithText';

import List, { ListItem } from 'hsl-shared-components/lib/List';

import A from 'hsl-shared-components/lib/Anchor';

import { setLanguage } from '../action/userPreferencesActions';
import ComponentUsageExample from './ComponentUsageExample';

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:link, &:visited, &:link:active, &:visited:active {
    color: inherit;
  }
`;

const cog = <Icons.Cog height="2.5rem" width="2.5rem" />;
const DropdownContent = [
  <List header="Liikkumisen palveluita" key="1">
    <ListItem>
      <A href="/test">Kaupunkipyörät</A>
    </ListItem>
    <ListItem>
      <A href="/test">Pyöräparkki</A>
    </ListItem>
    <ListItem>
      <A href="/test">Liityntäpysäköinti</A>
    </ListItem>
    <ListItem>
      <A href="/test">Lähibussit</A>
    </ListItem>
    <ListItem>
      <A href="/test">Pikaratikka</A>
    </ListItem>
  </List>,
  <List header="Tietoa HSL:stä" key="2">
    <ListItem>
      <A href="/test">Päätöksenteko</A>
    </ListItem>
    <ListItem>
      <A href="/test">Strategia</A>
    </ListItem>
    <ListItem>
      <A href="/test">Talous</A>
    </ListItem>
    <ListItem>
      <A href="/test">Hankinnat</A>
    </ListItem>
    <ListItem>
      <A href="/test">Julkaisut</A>
    </ListItem>
    <ListItem>
      <A href="/test">HSL työpaikkana ja avoimet työpaikat</A>
    </ListItem>
    <ListItem>
      <A href="/test">Viestintä</A>
    </ListItem>
  </List>,
  <div key="3">
    <IconWithText icon={cog} text="Yrityksille" textPosition="Right" />
    <IconWithText icon={cog} text="Oppilaitoksille" textPosition="Right" />
    <IconWithText icon={cog} text="Asiakasedut" textPosition="Right" />
    <IconWithText
      icon={cog}
      text="Osta HSL-fanituotteita"
      textPosition="Right"
    />
  </div>,
];
const Dropdown = (
  <DropdownMenu text="Lisää" textPosition="Bottom">
    {DropdownContent}
  </DropdownMenu>
);

const icons = [
  [
    <Icons.Tickets key="tickets" height="2.5rem" width="2.5rem" />,
    'Liput ja hinnat',
    'https://www.hsl.fi/liput-ja-hinnat',
  ],
  [
    <Icons.CustomerService
      key="customer_service"
      height="2.5rem"
      width="2.5rem"
    />,
    'Asiakaspalvelu',
    'https://www.hsl.fi/asiakaspalvelu',
  ],
  [
    <Icons.Latest key="latest" height="2.5rem" width="2.5rem" />,
    'Uutta',
    'https://www.hsl.fi/ajankohtaista?qt-archives=2#qt-archives',
  ],
];

const logo = <Icons.HSLLogo height="3.75rem" />;

const AppBarLarge = (props, { executeAction, location }) => {
  const menu = (
    <Menu
      selectedLanguage={props.locale}
      changeLanguage={language => executeAction(setLanguage, language)}
    >
      <MenuItem
        link={
          <StyledLink href="https://www.hsl.fi/saml/drupal_login?returnTo=https%3A//beta.hsl.fi/" />
        }
        icon={<Icons.SignIn height="3.5rem" />}
        text="Kirjaudu"
        textPosition="Right"
        key="signin"
      />
    </Menu>
  );

  return (
    <NavDesktop logo={logo} menu={menu}>
      <NavItem
        key="Reittiopas"
        link={<StyledLink to="/" />}
        icon={<Icons.JourneyPlanner height="2.5rem" width="2.5rem" />}
        text="Reittiopas"
        textPosition={'Bottom'}
        active={
          location.pathname !== '/' &&
          location.pathname !== '/lahellasi' &&
          location.pathname !== '/suosikit'
        }
      />
      {icons.map(icon =>
        <NavItem
          key={icon[1]}
          link={<StyledLink to={icon[2]} />}
          icon={icon[0]}
          text={icon[1]}
          textPosition={'Bottom'}
        />,
      )}
      {Dropdown}
    </NavDesktop>
  );
};

AppBarLarge.displayName = 'AppBarLarge';

AppBarLarge.contextTypes = {
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  config: PropTypes.object.isRequired,
  executeAction: PropTypes.func.isRequired,
};

AppBarLarge.propTypes = {
  locale: PropTypes.string.isRequired,
};

AppBarLarge.description = () =>
  <div>
    <p>AppBar of application for large display</p>
    <ComponentUsageExample description="">
      <AppBarLarge titleClicked={() => {}} />
    </ComponentUsageExample>
  </div>;

export default connectToStores(AppBarLarge, ['PreferencesStore'], context => {
  const language = context.getStore('PreferencesStore').getLanguage();
  return { locale: language };
});
