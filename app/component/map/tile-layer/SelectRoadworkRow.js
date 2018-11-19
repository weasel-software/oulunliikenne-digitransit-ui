import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectRoadworkRow(props) {
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_roadwork" />
        </div>
        <div className="padding-vertical-normal select-row-text">
          <span className="header-primary no-margin link-color">
            <FormattedMessage id="roadwork" defaultMessage="Roadwork">
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

SelectRoadworkRow.displayName = 'SelectRoadworkRow';

SelectRoadworkRow.description = (
  <div>
    <p>Renders a select citybike row</p>
    <ComponentUsageExample description="">
      <SelectRoadworkRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectRoadworkRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
};

export default SelectRoadworkRow;
