import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getContext from 'recompose/getContext';
import PropTypes from 'prop-types';

import {
  BicycleRouteBaanaLines,
  BicycleRouteBrandLines,
  BicycleRouteMainRegionalLines,
} from '../constants';
import { getSortedItems } from '../util/bicycleRouteUtils';

const BicycleRoutesLegend = ({ mapLayers }) => {
  if (
    !mapLayers ||
    !mapLayers.bicycleRoutes ||
    (!mapLayers.bicycleRouteTypes &&
      !mapLayers.bicycleRoutesBaana &&
      !mapLayers.bicycleRoutesBrand &&
      !mapLayers.bicycleRoutesMainRegional)
  ) {
    return null;
  }

  const renderItems = items =>
    getSortedItems(items).map(item => (
      <li key={item.type}>
        <div
          className="bicycle-routes-legend__color"
          style={{
            borderColor: item.color,
            borderStyle: item.dashed ? 'dashed' : 'solid',
          }}
        />
        <FormattedMessage id={`bicycle-routes-${item.type}`} />
      </li>
    ));

  const renderSelectedLines = () => {
    let allSelectedLines = {};
    if (mapLayers.bicycleRoutesBaana) {
      allSelectedLines = { ...allSelectedLines, ...BicycleRouteBaanaLines };
    }
    if (mapLayers.bicycleRoutesBrand) {
      allSelectedLines = { ...allSelectedLines, ...BicycleRouteBrandLines };
    }
    if (mapLayers.bicycleRoutesMainRegional) {
      allSelectedLines = {
        ...allSelectedLines,
        ...BicycleRouteMainRegionalLines,
      };
    }
    // Bicycle route types currently not needed.
    // Commented out instead of deleted in case
    // we need to re-enable them in the future.
    // if (mapLayers.bicycleRouteTypes) {
    //   allSelectedLines = { ...allSelectedLines, ...BicycleRouteTypeLines };
    // }
    return renderItems(allSelectedLines);
  };

  return (
    <div className="bicycle-routes-legend">
      <ul>{renderSelectedLines()}</ul>
    </div>
  );
};

BicycleRoutesLegend.propTypes = {
  mapLayers: PropTypes.object,
};

export default connectToStores(
  getContext({
    getStore: PropTypes.func.isRequired,
  })(BicycleRoutesLegend),
  ['MapLayerStore'],
  ({ getStore }) => ({
    mapLayers: getStore('MapLayerStore').getMapLayers(),
  }),
);
