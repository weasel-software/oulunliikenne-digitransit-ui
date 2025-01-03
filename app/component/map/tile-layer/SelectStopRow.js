import PropTypes from 'prop-types';
import React from 'react';
import ComponentUsageExample from '../../ComponentUsageExample';

function SelectStopRow(props) {
  const patterns = [];
  const { code, type } = props;
  patterns.push(
    <div key="first" className="route-detail-text">
      <span className={`${type.toLowerCase()} vehicle-number no-padding`}>
        {code}
      </span>
    </div>,
  );
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <svg
            viewBox="0 0 30 30"
            width="30"
            height="30"
            style={{ position: 'relative', left: 5 }}
            className={`${props.type.toLowerCase()} left`}
          >
            <circle
              r="8"
              cx="15"
              cy="15"
              strokeWidth="3"
              fill="None"
              stroke="currentColor"
            />
          </svg>
        </div>
        <div className="padding-vertical-normal select-stop-row-text">
          <span className="header-primary no-margin link-color">
            {props.name} ›
          </span>
          {patterns}
        </div>
        <div className="clear" />
      </div>
      <hr className="no-margin gray" />
    </div>
  );
}

SelectStopRow.displayName = 'SelectStopRow';

SelectStopRow.description = () => (
  <div>
    <p>Renders a select stop row</p>
    <ComponentUsageExample description="">
      <SelectStopRow
        name="DIAKONIAPUISTO"
        selectRow={() => {}}
        type="BUS"
        code="1234"
      />
    </ComponentUsageExample>
  </div>
);

SelectStopRow.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selectRow: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
};

export default SelectStopRow;
