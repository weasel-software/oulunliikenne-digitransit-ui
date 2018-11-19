import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectDisorderRow(props) {
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_disorder" />
        </div>
        <div className="padding-vertical-normal select-row-text">
          <span className="header-primary no-margin link-color">
            <FormattedMessage
              id="traffic-restriction"
              defaultMessage="Traffic restriction"
            >
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

SelectDisorderRow.displayName = 'SelectDisorderRow';

SelectDisorderRow.description = (
  <div>
    <p>Renders a select citybike row</p>
    <ComponentUsageExample description="">
      <SelectDisorderRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectDisorderRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
};

export default SelectDisorderRow;
