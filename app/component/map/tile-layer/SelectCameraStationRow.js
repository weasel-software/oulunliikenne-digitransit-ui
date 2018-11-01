import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectCameraStationRow(props) {
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_camera-station" />
        </div>
        <div className="padding-vertical-normal select-row-text">
          <span className="header-primary no-margin link-color">
            <FormattedMessage
              id="traffic-camera"
              defaultMessage="Traffic camera"
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

SelectCameraStationRow.displayName = 'SelectCameraStationRow';

SelectCameraStationRow.description = (
  <div>
    <p>Renders a select camera station row</p>
    <ComponentUsageExample description="">
      <SelectCameraStationRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectCameraStationRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
};

export default SelectCameraStationRow;
