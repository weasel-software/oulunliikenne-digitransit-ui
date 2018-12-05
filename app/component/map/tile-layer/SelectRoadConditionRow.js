import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectRoadConditionRow(props) {
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_road_condition" />
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

SelectRoadConditionRow.displayName = 'SelectRoadConditionRow';

SelectRoadConditionRow.description = (
  <div>
    <p>Renders a select road condition row</p>
    <ComponentUsageExample description="">
      <SelectRoadConditionRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectRoadConditionRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default SelectRoadConditionRow;
