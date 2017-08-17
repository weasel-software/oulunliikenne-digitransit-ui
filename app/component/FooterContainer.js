import React from 'react';
import styled from 'styled-components';

import Footer from 'hsl-shared-components/lib/Footer';
import Icons from 'hsl-shared-components/lib/Icons';
import Text from 'hsl-shared-components/lib/Typography';

const account = {
  title: 'Ota HSL -tunnus käyttöön',
  button: {
    text: 'Luo tunnus',
    onPress: () => {},
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
      onPress: () => {},
      onLongPress: () => {},
    },
    {
      icon: <Icons.Twitter height="27px" width="36px" fill="#007ac9" />,
      onPress: () => {},
      onLongPress: () => {},
    },
    {
      icon: <Icons.Instagram height="30px" width="30px" fill="#007ac9" />,
      onPress: () => {},
      onLongPress: () => {},
    },
    {
      icon: <Icons.Linkedin height="30px" width="36px" fill="#007ac9" />,
      onPress: () => {},
      onLongPress: () => {},
    },
    {
      icon: <Icons.Youtube height="34px" width="34px" fill="#007ac9" />,
      onPress: () => {},
      onLongPress: () => {},
    },
  ],
};

const LinkText = Text.extend`color: ${props => props.theme.primary};`;

const info = {
  copyright: '© Copyright HSL',
  links: [
    <LinkText key="contact">Yhteystiedot</LinkText>,
    <LinkText key="data_protection">Tietosuojalauseke</LinkText>,
    <LinkText key="register">Rekisteriseloste</LinkText>,
    <LinkText key="info">Tietoa sivustosta</LinkText>,
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
