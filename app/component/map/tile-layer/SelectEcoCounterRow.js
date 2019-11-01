import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectEcoCounterRow(props) {
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_maintenance-vehicle" />
        </div>
        <div className="padding-vertical-normal select-row-text">
          <span className="header-primary no-margin link-color">
            {`${props.name} ›`}
          </span>
        </div>
        <div className="clear" />
      </div>
      <hr className="no-margin gray" />
    </div>
  );
}

SelectEcoCounterRow.displayName = 'SelectEcoCounterRow';

SelectEcoCounterRow.description = (
  <div>
    <p>Renders a select eco counter row</p>
    <ComponentUsageExample description="">
      <SelectEcoCounterRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectEcoCounterRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default SelectEcoCounterRow;
