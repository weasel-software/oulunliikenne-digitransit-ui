import * as React from 'react';
import forEach from 'lodash/forEach';
import { FormattedMessage } from 'react-intl';
import connectToStores from 'fluxible-addons-react/connectToStores';
import getContext from 'recompose/getContext';
import PropTypes from 'prop-types';

import { sortByPriority } from '../util/maintenanceUtils';
import {
  BicycleRouteBaanaLines,
  BicycleRouteBrandLines,
  BicycleRouteMainRegionalLines,
  BicycleRouteTypeLines,
} from '../constants';

const getItems = (items) => {
  return Object.keys(items).map(key => {
    return {
      type: key,
      ...items[key],
    };
  });
};

const BicycleRoutesLegend = ({ mapLayers }) => {
  if (!mapLayers || !mapLayers.bicycleRoutes) {
    return <div className="bicycle-routes-legend" />;
  }

  const renderItems = items =>
    getItems(items).map(item => (
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

  return (
    <div className="bicycle-routes-legend">
      <ul>
        {[
          ...(mapLayers.bicycleRoutesBaana
            ? renderItems(BicycleRouteBaanaLines)
            : []),
          ...(mapLayers.bicycleRoutesBrand
            ? renderItems(BicycleRouteBrandLines)
            : []),
          ...(mapLayers.bicycleRoutesMainRegional
            ? renderItems(BicycleRouteMainRegionalLines)
            : []),
          ...(mapLayers.bicycleRouteTypes
            ? renderItems(BicycleRouteTypeLines)
            : []),
        ]}
      </ul>
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
