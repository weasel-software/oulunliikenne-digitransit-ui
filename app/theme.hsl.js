// these sizes are arbitrary and you can set them to whatever you wish
import { css } from 'styled-components';

export const sizes = {
  large: 1299,
  medium: 999,
  small: 869,
};

// iterate through the sizes and create a media template
const Media = Object.keys(sizes).reduce((accumulator, label) => {
  // use rem in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = sizes[label] / 16;
  const returnObject = Object.assign({}, accumulator);
  returnObject[label] = (...args) => css`
    @media (max-width: ${emSize}rem) {
      ${css(...args)}
    }
  `;
  return returnObject;
}, {});

const primaryBlue = '#007ac9';
const primaryWhite = '#ffffff';

const hslTheme = {
  Media, // used in components
  sizes, // used by utils
  primary: primaryBlue,
  primaryText: primaryWhite,
  listItemMarker: '#62bae7',
  secondary: '#888888',
  default: '#b7b7b7',
  background: primaryBlue,
  md: '900px',
  scrollNavHeight: '3.75rem',
  logoHeight: '4rem',
  logoFill: primaryWhite,
  radioBtnActive: '#0062a1',
  fontFamily: '"Gotham Rounded SSm A, Gotham Rounded SSm B"',
  fontFamilyNarrow: '"Gotham XNarrow SSm A, Gotham XNarrow SSm B"',
  fontSize: '16px',
  fontWeight: '500',
  letterSpacing: '-0.5px',
  activatablePointerHeight: '0.6rem',
  activatableLineHeight: '4px',
};

export default hslTheme;
