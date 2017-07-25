import PropTypes from 'prop-types';
import React from 'react';
import { routerShape, matchShape } from 'found';
import getContext from 'recompose/getContext';
import AppBarSmall from './AppBarSmall';
import AppBarLarge from './AppBarLarge';

const AppBarContainer = ({ breakpoint, router, match, ...args }) =>
  (breakpoint !== 'large' &&
    <AppBarSmall
      {...args}
      showLogo={router.isActive(match, { pathname: '/' }, { exact: true })}
    />) ||
  <AppBarLarge {...args} titleClicked={() => router.push('/lahellasi')} />;

const WithContext = getContext({
  router: routerShape.isRequired,
  breakpoint: PropTypes.string.isRequired,
})(AppBarContainer);

WithContext.propTypes = {
  disableBackButton: PropTypes.bool,
  title: PropTypes.node,
  match: matchShape.isRequired,
};

export default WithContext;
