/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';
import './city-weather-station-container.scss';
import Icon from './Icon';

const getWindDirection = degrees => {
  const directions = [
    'north',
    'northeast',
    'east',
    'southeast',
    'south',
    'southwest',
    'west',
    'northwest',
  ];

  const index = Math.round(degrees / 45.0) % directions.length;

  return directions[index];
};

const CityWeatherStationContent = ({ sensors, cameras, openCameraModal }) => {
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
    <table className="component-list">
      <tbody>
        <tr>
          {airTemperature && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="air-temperature"
                        defaultMessage="Air temperature"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr className="value">
                    <td>
                      <span>{airTemperature.sensorValue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{airTemperature.sensorUnit}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
          {roadSurfaceTemperature && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="road-temperature"
                        defaultMessage="Road temperature"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr className="value">
                    <td>
                      <span>{roadSurfaceTemperature.sensorValue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{roadSurfaceTemperature.sensorUnit}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
        </tr>
        <tr>
          {windSpeed && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="wind-speed"
                        defaultMessage="Wind speed"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr className="value">
                    <td>
                      <span>{windSpeed.sensorValue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{windSpeed.sensorUnit}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
          {windDirection && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="wind-direction"
                        defaultMessage="Wind direction"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr className="value">
                    <td>
                      <span>
                        <FormattedMessage
                          id={getWindDirection(windDirection.sensorValue)}
                          defaultMessage="North"
                        >
                          {(...content) => `${content}`}
                        </FormattedMessage>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {windDirection.sensorValue}
                      °
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
        </tr>
        <tr>
          {airRelativeHumidity && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="air-humidity"
                        defaultMessage="Air humidity"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr className="value">
                    <td>
                      <span>{airRelativeHumidity.sensorValue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>%</td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
          {rainfallDepth && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="rainfall-depth"
                        defaultMessage="Rainfall depth"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr className="value">
                    <td>
                      <span>{rainfallDepth.sensorValue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{rainfallDepth.sensorUnit}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
        </tr>
        <tr>
          {snowDepth && (
            <td>
              <table className="sensor-info">
                <tbody>
                  <tr>
                    <td>
                      <FormattedMessage
                        id="snow-depth"
                        defaultMessage="Snow depth"
                      >
                        {(...content) => `${content}`}
                      </FormattedMessage>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="value">{snowDepth.sensorValue}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{snowDepth.sensorUnit}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          )}
          {rainfallDepth && (
            <td>
              <div
                className="camera-icon-container"
                onClick={() => openCameraModal(cameras)}
              >
                <Icon img="icon-icon_camera-station" className="camera-icon" />
              </div>
            </td>
          )}
        </tr>
        <tr>
          <td colSpan={2} className="last-updated">
            <FormattedMessage id="last-updated" defaultMessage="Last updated">
              {(...content) => `${content} `}
            </FormattedMessage>
            {moment(airTemperature.measuredTime).format('HH:mm:ss') || ''}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

CityWeatherStationContent.displayName = 'CityWeatherStationContent';

CityWeatherStationContent.description = (
  <div>
    <p>RendTimeers content of a roadwork popup or modal</p>
    <ComponentUsageExample description="">
      <CityWeatherStationContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

CityWeatherStationContent.propTypes = {
  sensors: PropTypes.array.isRequired,
  cameras: PropTypes.array.isRequired,
  openCameraModal: PropTypes.func.isRequired,
};

export default CityWeatherStationContent;
