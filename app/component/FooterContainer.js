import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router';

import Footer from 'hsl-shared-components/lib/Footer';
import Icons from 'hsl-shared-components/lib/Icons';
import Text from 'hsl-shared-components/lib/Typography';

const account = {
  title: 'Ota HSL -tunnus käyttöön',
  button: {
    text: 'Luo tunnus',
    onPress: () => {
      window.location = 'https://login.hsl.fi/user/register';
    },
  },
  benefits: [
    'Lataa matkakorttia verkossa',
    'Hyödynnä asiakasetuja',
    'Tallenna suosikki linjat, reitit ja paikat',
    'Ota kaupunkipyörät käyttöön',
  ],
};

const socialMedia = {
  title: 'Tykkää, seuraa ja keskustele',
  icons: [
    {
      icon: <Icons.Facebook height="36px" width="18px" fill="#007ac9" />,
      onPress: () => {
        window.location = 'https://www.facebook.com/helsinginseudunliikenne/';
      },
      onLongPress: () => {},
    },
    {
      icon: <Icons.Twitter height="27px" width="36px" fill="#007ac9" />,
      onPress: () => {
        window.location = 'https://twitter.com/hsl_hrt';
      },
      onLongPress: () => {},
    },
    {
      icon: <Icons.Instagram height="30px" width="30px" fill="#007ac9" />,
      onPress: () => {
        window.location = 'https://www.instagram.com/hsl_hrt/';
      },
      onLongPress: () => {},
    },
    {
      icon: <Icons.Linkedin height="30px" width="36px" fill="#007ac9" />,
      onPress: () => {
        window.location = 'https://www.linkedin.com/company-beta/1032423/';
      },
      onLongPress: () => {},
    },
    {
      icon: <Icons.Youtube height="34px" width="34px" fill="#007ac9" />,
      onPress: () => {
        window.location = 'https://www.youtube.com/user/hslhrt';
      },
      onLongPress: () => {},
    },
  ],
};

const LinkText = Text.extend`color: ${props => props.theme.primary};`;

const StyledLink = styled(Link)`text-decoration: none;`;

const info = {
  copyright: '© Copyright HSL',
  links: [
    <StyledLink key="contact" to="https://www.hsl.fi/yhteystiedot">
      <LinkText>Yhteystiedot</LinkText>
    </StyledLink>,
    <StyledLink key="data_protection" to="https://www.hsl.fi/tietosuojaseloste">
      <LinkText>Tietosuojalauseke</LinkText>
    </StyledLink>,
    <StyledLink key="register" to="https://www.hsl.fi/tietoa-sivustosta">
      <LinkText>Rekisteriseloste</LinkText>
    </StyledLink>,
    <StyledLink key="info" to="/tietoja-palvelusta">
      <LinkText>Tietoa sivustosta</LinkText>
    </StyledLink>,
  ],
};

const StyldeFooter = styled(Footer)`
  background-color: white;
`;

export default function FooterContainer() {
  return (
    <StyldeFooter info={info} account={account} socialMedia={socialMedia} />
  );
}
