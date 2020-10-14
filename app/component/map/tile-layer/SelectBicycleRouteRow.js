import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';
import { BicycleRouteLines } from '../../../constants';
import { getBicycleRouteKey } from '../../../util/bicycleRouteUtils';

const SelectBicycleRouteRow = ({ layerName, type, selectRow }) => {
  const routeKey = getBicycleRouteKey(layerName, type);

  if (routeKey) {
    const color = BicycleRouteLines[routeKey]
      ? BicycleRouteLines[routeKey].color
      : undefined;
    return (
      <div className="no-margin">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div className="cursor-pointer select-row" onClick={selectRow}>
          <div
            className="padding-vertical-normal select-row-icon"
            style={{ fontSize: '12px' }}
          >
            <Icon color={color} img="icon-icon_bicycle-withoutBox" />
          </div>
          <div className="padding-vertical-normal select-row-text">
            <span className="header-primary no-margin link-color">
              <FormattedMessage id={`bicycle-routes-${routeKey}`}>
                {(...content) => `${content} ›`}
              </FormattedMessage>
            </span>
          </div>
          <div className="clear" />
        </div>
        <hr className="no-margin gray" />
      </div>
    );
  }
  return null;
};

SelectBicycleRouteRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
  layerName: PropTypes.string.isRequired,
  type: PropTypes.string,
};

SelectBicycleRouteRow.defaultProps = {
  type: undefined,
};

SelectBicycleRouteRow.displayName = 'SelectBicycleRouteRow';

SelectBicycleRouteRow.description = (
  <div>
    <p>Renders a select road sign row</p>
    <ComponentUsageExample description="">
      <SelectBicycleRouteRow
        layerName="bicycleRoutesBaana"
        type="PLANNED"
        selectRow={() => {}}
      />
    </ComponentUsageExample>
  </div>
);

export default SelectBicycleRouteRow;
