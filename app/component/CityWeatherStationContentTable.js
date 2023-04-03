/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import { FormattedMessage, intlShape } from 'react-intl';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';
import './city-weather-station-container.scss';
import Icon from './Icon';
import Card from './Card';
import CardHeader from './CardHeader';

const SensorInfo = ({ id, defaultMessage, sensor }) => {
  if (!sensor) {
    return null;
  }

  if (sensor.sensorValue === undefined || sensor.sensorUnit === undefined) {
    return null;
  }

  return (
    <td>
      <table className="sensor-info">
        <tbody>
          <tr>
            <td>
              <FormattedMessage id={id} defaultMessage={defaultMessage}>
                {(...content) => `${content}`}
              </FormattedMessage>
            </td>
          </tr>
          <tr>
            <td>{sensor.sensorValue}</td>
          </tr>
          <tr>
            <td>{sensor.sensorUnit}</td>
          </tr>
        </tbody>
      </table>
    </td>
  );
};

SensorInfo.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
  sensor: PropTypes.object,
};

SensorInfo.defaultProps = {
  sensor: undefined,
};

const CameraIcon = ({ id, onClick }) => (
  <td key={id}>
    <div className="camera-icon-container" onClick={onClick}>
      <Icon img="icon-icon_camera-station" className="camera-icon" />
    </div>
  </td>
);

CameraIcon.propTypes = {
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const CityWeatherStationContentTable = (
  { getWindDirection, toggleView, toggleImageView, station },
  { intl },
) => {
  const { cameras, sensorValues } = station;

  const snowDepth = sensorValues.find(item => item.name === 'SNOW_DEPTH');
  const rainfallDepth = sensorValues.find(
    item => item.name === 'RAINFALL_DEPTH',
  );
  const airRelativeHumidity = sensorValues.find(
    item => item.name === 'AIR_RELATIVE_HUMIDITY',
  );
  const windDirection = sensorValues.find(
    item => item.name === 'WIND_DIRECTION',
  );
  const windSpeed = sensorValues.find(item => item.name === 'WIND_SPEED');
  const airTemperature = sensorValues.find(
    item => item.name === 'AIR_TEMPERATURE',
  );
  const roadSurfaceTemperature = sensorValues.find(
    item => item.name === 'ROAD_SURFACE_TEMPERATURE',
  );

  const { measuredTime } = airTemperature;

  const localName = station.name;

  const cameraInfo = { cameras, localName, measuredTime };

  const tableContent = [
    [
      {
        id: 'air-temperature',
        defaultMessage: 'Air temperature',
        sensor: airTemperature,
        Component: SensorInfo,
      },
      {
        id: 'road-temperature',
        defaultMessage: 'Road temperature',
        sensor: roadSurfaceTemperature,
        Component: SensorInfo,
      },
    ],
    [
      {
        id: 'wind-speed',
        defaultMessage: 'Wind speed',
        sensor: windSpeed,
        Component: SensorInfo,
      },
      {
        id: 'wind-direction',
        defaultMessage: 'Wind direction',
        sensor:
          windDirection.sensorValue === undefined
            ? undefined
            : {
                sensorValue: (
                  <FormattedMessage
                    id={getWindDirection(windDirection.sensorValue)}
                    defaultMessage="North"
                  >
                    {(...content) => `${content} `}
                  </FormattedMessage>
                ),
                sensorUnit: `${windDirection.sensorValue}°`,
              },
        Component: SensorInfo,
      },
    ],
    [
      {
        id: 'air-humidity',
        defaultMessage: 'Air humidity',
        sensor: {
          ...airRelativeHumidity,
          sensorUnit: '%',
        },
        Component: SensorInfo,
      },
      {
        id: 'rainfall-depth',
        defaultMessage: 'Rainfall depth',
        sensor: rainfallDepth,
        Component: SensorInfo,
      },
    ],
    [
      {
        id: 'snow-depth',
        defaultMessage: 'snow-depth',
        sensor: snowDepth,
        Component: SensorInfo,
      },
      {
        id: 'camera',
        onClick: () => toggleImageView(cameraInfo),
        Component: CameraIcon,
      },
    ],
  ];

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'weather-station',
            defaultMessage: 'Weather station',
          })}
          description={localName}
          icon="icon-icon_weather-station"
          unlinked
        />
        <table className="component-list">
          <tbody>
            {tableContent.map(arr => (
              <tr key={_.uniqueId()}>
                {arr.map(obj => {
                  const { Component } = obj;
                  return <Component key={_.uniqueId()} {...obj} />;
                })}
              </tr>
            ))}
            {measuredTime && (
              <tr>
                <td colSpan={2} className="updated">
                  <FormattedMessage
                    id="last-updated"
                    defaultMessage="Last updated"
                  >
                    {(...content) => `${content} `}
                  </FormattedMessage>
                  {moment(measuredTime).format('HH:mm:ss') || ''}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={2}>
                <div
                  aria-hidden="true"
                  className="text-button"
                  onClick={() => toggleView()}
                >
                  {`${intl.formatMessage({
                    id: 'show-information-as-list',
                    defaultMessage: 'Show information as list',
                  })} >`}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

CityWeatherStationContentTable.displayName = 'CityWeatherStationContentTable';

CityWeatherStationContentTable.description = (
  <div>
    <p>City Weather station content</p>
    <ComponentUsageExample description="">
      <CityWeatherStationContentTable comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

CityWeatherStationContentTable.propTypes = {
  station: PropTypes.object.isRequired,
  getWindDirection: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
  toggleImageView: PropTypes.func.isRequired,
};

CityWeatherStationContentTable.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(
  connectToStores(
    CityWeatherStationContentTable,
    ['PreferencesStore'],
    context => ({
      lang: context.getStore('PreferencesStore').getLanguage(),
    }),
  ),
  {
    fragments: {
      station: () => Relay.QL`
      fragment on CityWeatherStation {
        weatherStationId
        name
        lon
        lat
        sensorValues {
          name
          sensorValue
          sensorUnit
          measuredTime
        }
        cameras {
          cameraId
          imageUrl
        }
      }
    `,
    },
  },
);
