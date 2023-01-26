/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const CityWeatherStationContentList = ({ sensors }) => {
  const snowDepth = sensors.find(item => item.name === 'SNOW_DEPTH');
  const rainfallDepth = sensors.find(item => item.name === 'RAINFALL_DEPTH');
  const airRelativeHumidity = sensors.find(
    item => item.name === 'AIR_RELATIVE_HUMIDITY',
  );
  const windDirection = sensors.find(item => item.name === 'WIND_DIRECTION');
  const windSpeed = sensors.find(item => item.name === 'WIND_SPEED');
  const airTemperature = sensors.find(item => item.name === 'AIR_TEMPERATURE');
  const roadSurfaceTemperature = sensors.find(
    item => item.name === 'ROAD_SURFACE_TEMPERATURE',
  );

  return (
    <table className="list">
      <tbody>
        {airTemperature && (
          <tr>
            <td>
              <FormattedMessage
                id="air-temperature"
                defaultMessage="Air temperature"
              >
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>
              {airTemperature.sensorValue} {airTemperature.sensorUnit}
            </td>
          </tr>
        )}
        {roadSurfaceTemperature && (
          <tr>
            <td>
              <FormattedMessage
                id="road-temperature"
                defaultMessage="Road temperature"
              >
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>
              {roadSurfaceTemperature.sensorValue}{' '}
              {roadSurfaceTemperature.sensorUnit}
            </td>
          </tr>
        )}
        {windSpeed && (
          <tr>
            <td>
              <FormattedMessage id="wind-speed" defaultMessage="Wind speed">
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>
              <span>
                {windSpeed.sensorValue} {windSpeed.sensorUnit}
              </span>
            </td>
          </tr>
        )}
        {windDirection && (
          <tr>
            <td>
              <FormattedMessage
                id="wind-direction"
                defaultMessage="Wind direction"
              >
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>
              {windDirection.sensorValue}
              °
            </td>
          </tr>
        )}
        {airRelativeHumidity && (
          <tr>
            <td>
              <FormattedMessage id="air-humidity" defaultMessage="Air humidity">
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>{airRelativeHumidity.sensorValue} %</td>
          </tr>
        )}
        {rainfallDepth && (
          <tr>
            <td>
              <FormattedMessage
                id="rainfall-depth"
                defaultMessage="Rainfall depth"
              >
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>
              <span>
                {rainfallDepth.sensorValue} {rainfallDepth.sensorUnit}
              </span>
            </td>
          </tr>
        )}
        {snowDepth && (
          <tr>
            <td>
              <FormattedMessage id="snow-depth" defaultMessage="Snow depth">
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
            <td>
              {snowDepth.sensorValue} {snowDepth.sensorUnit}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

CityWeatherStationContentList.displayName = 'CityWeatherStationContentList';

CityWeatherStationContentList.description = (
  <div>
    <p>RendTimeers content of a roadwork popup or modal</p>
    <ComponentUsageExample description="">
      <CityWeatherStationContentList comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

CityWeatherStationContentList.propTypes = {
  sensors: PropTypes.array.isRequired,
};

export default CityWeatherStationContentList;
