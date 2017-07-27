import React from 'react';
import PropTypes from 'prop-types';
import StaticContainer from 'react-static-container';

// TODO: https://github.com/4Catalyzer/found-relay/issues/43

export default function PreviousPropsRenderer({ Component, props }) {
  return (
    <StaticContainer shouldUpdate={Component && props}>
      {Component && props ? <Component {...props} /> : null}
    </StaticContainer>
  );
}

PreviousPropsRenderer.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.instanceOf(React.Component).isRequired,
    PropTypes.func.isRequired,
  ]),
  props: PropTypes.object,
};
