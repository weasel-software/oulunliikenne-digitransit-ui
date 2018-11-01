import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectTmsStationRow(props, { intl }) {
  let localName = props.names
    ? JSON.parse(props.names)[intl.locale] || props.name
    : props.name;

  if (!localName) {
    localName = intl.formatMessage({
      id: 'traffic-monitoring',
      defaultMessage: 'Traffic monitoring',
    });
  }

  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_tms-station" />
        </div>
        <div className="padding-vertical-normal select-row-text">
          <span className="header-primary no-margin link-color">
            {localName} ›
          </span>
        </div>
        <div className="clear" />
      </div>
      <hr className="no-margin gray" />
    </div>
  );
}

SelectTmsStationRow.displayName = 'SelectTmsStationRow';

SelectTmsStationRow.description = (
  <div>
    <p>Renders a select TMS station row</p>
    <ComponentUsageExample description="">
      <SelectTmsStationRow
        name="Leppävaara"
        names={'{"en": "Leppävaara", "fi": "Leppävaara", "sv": "Leppävaara"}'}
        selectRow={() => {}}
      />
    </ComponentUsageExample>
  </div>
);

SelectTmsStationRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
  names: PropTypes.string,
  name: PropTypes.string,
};

SelectTmsStationRow.contextTypes = {
  intl: intlShape,
};

export default SelectTmsStationRow;
