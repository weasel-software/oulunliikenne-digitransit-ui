/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import _ from 'lodash';
import { FormattedMessage, intlShape } from 'react-intl';
import { connectToStores } from 'fluxible-addons-react';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';
import Card from './Card';
import CardHeader from './CardHeader';

import './city-weather-station-container.scss';

const SensorInfo = ({ id, defaultMessage, sensor }) => {
  if (sensor === undefined) {
    return null;
  }

  if (sensor.sensorValue === undefined || sensor.sensorUnit === undefined) {
    return null;
  }
  return (
    <tr>
      <td>
        <FormattedMessage id={id} defaultMessage={defaultMessage}>
          {(...content) => `${content} ${sensor.sensorUnit}`}
        </FormattedMessage>
      </td>
      <td>{sensor.sensorValue}</td>
    </tr>
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

const rainTypes = {
  '0': 'no-rain',
  '98': 'has-rain',
  '4': 'light-snow',
  '5': 'moderate-snow',
  '6': 'heavy-snow',
};

const getRainClassificationType = number => {
  const type = rainTypes[number];

  if (type === null || type === undefined) {
    return 'no-rain';
  }

  return type;
};

const CityWeatherStationContentList = (
  { toggleView, station, getWindDirection },
  { intl },
) => {
  const { sensorValues } = station;
  const dewPointTemperature = sensorValues.find(
    item => item.name === 'DEW_POINT_TEMPERATURE',
  );
  const snowDepth = sensorValues.find(item => item.name === 'SNOW_DEPTH');
  const rainfallIntensity = sensorValues.find(
    item => item.name === 'RAINFALL_INTENSITY',
  );
  const rainfallDepth = sensorValues.find(
    item => item.name === 'RAINFALL_DEPTH',
  );
  const rainClassification = sensorValues.find(
    item => item.name === 'RAIN_CLASSIFICATION',
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

  const tableContent = [
    {
      id: 'air-temperature',
      defaultMessage: 'Air temperature',
      sensor: airTemperature,
      Component: SensorInfo,
    },
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
      id: 'dew-point-temperature',
      defaultMessage: 'Dew point temperature',
      sensor: {
        ...dewPointTemperature,
        sensorUnit: '%',
      },
      Component: SensorInfo,
    },
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
        windDirection === undefined
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
              sensorUnit: '',
            },
      Component: SensorInfo,
    },
    {
      id: 'rainfall-depth',
      defaultMessage: 'Rainfall depth',
      sensor: rainfallDepth,
      Component: SensorInfo,
    },
    {
      id: 'rainfall-intensity',
      defaultMessage: 'Rainfall intensity',
      sensor: rainfallIntensity,
      Component: SensorInfo,
    },
    {
      id: 'snow-depth',
      defaultMessage: 'Snow depth',
      sensor: snowDepth,
      Component: SensorInfo,
    },
    {
      id: 'rain-classification',
      defaultMessage: 'Rain classification',
      sensor:
        rainClassification === undefined
          ? undefined
          : {
              sensorValue: (
                <FormattedMessage
                  id={getRainClassificationType(rainClassification.sensorValue)}
                  defaultMessage="North"
                >
                  {(...content) => `${content} `}
                </FormattedMessage>
              ),
              sensorUnit: '',
            },
      Component: SensorInfo,
    },
    {
      id: 'road-temperature',
      defaultMessage: 'Road temperature',
      sensor: roadSurfaceTemperature,
      Component: SensorInfo,
    },
  ];

  const { measuredTime } = airTemperature;

  const localName = station.name;

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
        <table className="list">
          <tbody>
            {tableContent.map(obj => {
              const { Component } = obj;
              return <Component key={_.uniqueId()} {...obj} />;
            })}
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
                  {`< ${intl.formatMessage({
                    id: 'back',
                    defaultMessage: 'Go back',
                  })}`}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
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
  station: PropTypes.object.isRequired,
  toggleView: PropTypes.func.isRequired,
  getWindDirection: PropTypes.func.isRequired,
};

CityWeatherStationContentList.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(
  connectToStores(
    CityWeatherStationContentList,
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
