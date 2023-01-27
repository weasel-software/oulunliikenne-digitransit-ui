import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
function SelectCityWeatherStationRow(props, { intl }) {
  const defaultName = intl.formatMessage({
    id: 'city-weather-station',
    defaultMessage: 'City weather station',
  });
  const localName =
    !props.name || props.name !== undefined ? props.name : defaultName;
  return (
    <div className="no-margin">
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_weather-station" />
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

SelectCityWeatherStationRow.displayName = 'SelectCityWeatherStationRow';

SelectCityWeatherStationRow.description = (
  <div>
    <p>Renders a select weather station row</p>
    <ComponentUsageExample description="">
      <SelectCityWeatherStationRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectCityWeatherStationRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

SelectCityWeatherStationRow.contextTypes = {
  intl: intlShape,
};

export default SelectCityWeatherStationRow;
