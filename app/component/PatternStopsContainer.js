import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';

import RouteListHeader from './RouteListHeader';
import RouteStopListContainer from './RouteStopListContainer';

class PatternStopsContainer extends React.Component {
  static propTypes = {
    pattern: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      state: PropTypes.object,
    }).isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    breakpoint: PropTypes.string.isRequired,
  };

  toggleFullscreenMap = () => {
    if (
      this.props.location.state &&
      this.props.location.state.fullscreenMap === true
    ) {
      this.context.router.go(-1);
      return;
    }
    this.context.router.push({
      ...this.props.location,
      state: { ...this.props.location.state, fullscreenMap: true },
    });
  };

  render() {
    if (!this.props.pattern) {
      return false;
    }

    if (
      this.props.location.state &&
      this.props.location.state.fullscreenMap === true &&
      this.context.breakpoint !== 'large'
    ) {
      return <div className="route-page-content" />;
    }

    return (
      <div className="route-page-content">
        <RouteListHeader
          key="header"
          className={`bp-${this.context.breakpoint}`}
        />
        <RouteStopListContainer
          key="list"
          pattern={this.props.pattern}
          patternId={this.props.pattern.code}
        />
      </div>
    );
  }
}

export default createFragmentContainer(PatternStopsContainer, {
  pattern: graphql`
    fragment PatternStopsContainer_pattern on Pattern {
      code
      ...RouteStopListContainer_pattern
    }
  `,
});
