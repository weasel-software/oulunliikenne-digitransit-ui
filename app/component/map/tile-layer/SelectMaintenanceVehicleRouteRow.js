import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

const SelectMaintenanceVehicleRouteRow = props => (
  <div className="no-margin">
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
    <div className="cursor-pointer select-row" onClick={props.selectRow}>
      <div className="padding-vertical-normal select-row-icon">
        <Icon img="icon-icon_maintenance-vehicle" />
      </div>
      <div className="padding-vertical-normal select-row-text">
        <span className="header-primary no-margin link-color">
          <FormattedMessage id="maintenance-job">
            {(...content) => `${content} ›`}
          </FormattedMessage>
        </span>
      </div>
      <div className="clear" />
    </div>
    <hr className="no-margin gray" />
  </div>
);

SelectMaintenanceVehicleRouteRow.displayName =
  'SelectMaintenanceVehicleRouteRow';

SelectMaintenanceVehicleRouteRow.description = (
  <div>
    <p>Renders a select maintenance vehicle route row</p>
    <ComponentUsageExample description="">
      <SelectMaintenanceVehicleRouteRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectMaintenanceVehicleRouteRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
};

export default SelectMaintenanceVehicleRouteRow;
