import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';

import Map from './map/Map';
import SelectedStopPopup from './map/popups/SelectedStopPopup';
import SelectedStopPopupContent from './SelectedStopPopupContent';
import Icon from './Icon';

const toggleFullscreenMap = (fullscreenMap, location, router) => {
  if (fullscreenMap) {
    router.go(-1);
    return;
  }
  router.push({
    ...location,
    state: { ...location.state, fullscreenMap: true },
  });
};

const fullscreenMapOverlay = (fullscreenMap, location, router) =>
  !fullscreenMap &&
  <div
    className="map-click-prevent-overlay"
    key="overlay"
    onClick={() => {
      toggleFullscreenMap(fullscreenMap, location, router);
    }}
  />;

const fullscreenMapToggle = (fullscreenMap, location, router) =>
  <div
    className="fullscreen-toggle"
    key="fullscreen-toggle"
    onClick={() => {
      toggleFullscreenMap(fullscreenMap, location, router);
    }}
  >
    <Icon img="icon-icon_maximize" className="cursor-pointer" />
  </div>;

const StopPageMap = ({ stop, params }, { breakpoint, router, location }) => {
  if (!stop) {
    return false;
  }

  const fullscreenMap = location.state && location.state.fullscreenMap === true;
  const leafletObjs = [];
  const children = [];

  if (breakpoint === 'large') {
    leafletObjs.push(
      <SelectedStopPopup lat={stop.lat} lon={stop.lon} key="SelectedStopPopup">
        <SelectedStopPopupContent stop={stop} />
      </SelectedStopPopup>,
    );
  } else {
    children.push(fullscreenMapOverlay(fullscreenMap, location, router));
    children.push(fullscreenMapToggle(fullscreenMap, location, router));
  }

  const showScale = fullscreenMap || breakpoint === 'large';

  return (
    <Map
      className="full"
      lat={stop.lat}
      lon={stop.lon}
      zoom={!params.stopId || stop.platformCode ? 18 : 16}
      showStops
      hilightedStops={[params.stopId]}
      leafletObjs={leafletObjs}
      showScaleBar={showScale}
    >
      {children}
    </Map>
  );
};

StopPageMap.contextTypes = {
  breakpoint: PropTypes.string.isRequired,
  router: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    state: PropTypes.object,
  }).isRequired,
};

StopPageMap.propTypes = {
  stop: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    platformCode: PropTypes.string,
  }).isRequired,
  params: PropTypes.oneOfType([
    PropTypes.shape({ stopId: PropTypes.string.isRequired }).isRequired,
    PropTypes.shape({ terminalId: PropTypes.string.isRequired }).isRequired,
  ]).isRequired,
};

export default createFragmentContainer(StopPageMap, {
  stop: graphql`
    fragment StopPageMap_stop on Stop {
      lat
      lon
      platformCode
      name
      code
      desc
    }
  `,
});
