import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';
import { getRoadSignIconId } from '../../../util/mapIconUtils';

const renderIcon = (type, value, severity) => {
  const iconId = getRoadSignIconId(type, value, severity);
  return iconId ? <Icon img={iconId} /> : null;
};

const SelectRoadSignRow = ({ type, displayValue, severity, ...props }) => (
  <div className="no-margin">
    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
    <div className="cursor-pointer select-row" onClick={props.selectRow}>
      <div className="padding-vertical-normal select-row-icon">
        {renderIcon(type, displayValue, severity)}
      </div>
      <div className="padding-vertical-normal select-row-text">
        <span className="header-primary no-margin link-color">
          <FormattedMessage id="road-sign">
            {(...content) => `${content} ›`}
          </FormattedMessage>
        </span>
      </div>
      <div className="clear" />
    </div>
    <hr className="no-margin gray" />
  </div>
);

SelectRoadSignRow.propTypes = {
  type: PropTypes.string.isRequired,
  displayValue: PropTypes.string.isRequired,
  selectRow: PropTypes.func.isRequired,
  severity: PropTypes.string,
};

SelectRoadSignRow.defaultProps = {
  severity: '',
};

SelectRoadSignRow.displayName = 'SelectRoadSignRow';

SelectRoadSignRow.description = (
  <div>
    <p>Renders a select road sign row</p>
    <ComponentUsageExample description="">
      <SelectRoadSignRow
        type="SPEEDLIMIT"
        displayValue="100"
        selectRow={() => {}}
      />
    </ComponentUsageExample>
  </div>
);

export default SelectRoadSignRow;
