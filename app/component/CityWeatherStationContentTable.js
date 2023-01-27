/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import { FormattedMessage, intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';
import './city-weather-station-container.scss';
import Icon from './Icon';
import Card from './Card';
import CardHeader from './CardHeader';
import ImageSlider from './ImageSlider';

const SensorInfo = ({ id, defaultMessage, value, unit }) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (unit === undefined || unit === null) {
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
            <td>{value}</td>
          </tr>
          <tr>
            <td>{unit}</td>
          </tr>
        </tbody>
      </table>
    </td>
  );
};

SensorInfo.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  unit: PropTypes.any.isRequired,
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
  { getWindDirection, toggleView, cityWeatherStation },
  { intl, router, location },
) => {
  const { cameras, sensorValues } = cityWeatherStation;
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

  const localName = cityWeatherStation.name;

  const openCameraModal = () => {
    router.push({
      ...location,
      state: {
        ...location.state,
        moreInfoModalOpen: true,
        moreInfoModalTitle: (
          <table>
            <tbody>
              <tr>
                <td style={{ paddingRight: '10px' }}>
                  <Icon
                    img="icon-icon_camera-station"
                    className="camera-icon"
                  />
                </td>
                <td>{localName}</td>
              </tr>
            </tbody>
          </table>
        ),
        moreInfoModalContent: (
          <>
            <ImageSlider>
              {cameras.map(item => (
                <figure key={_.uniqueId()} className="slide">
                  <img
                    className="camera-img"
                    src={item.imageUrl}
                    alt={item.presentationName}
                    onClick={() => {
                      window.open(item.imageUrl, '_blank');
                    }}
                  />
                </figure>
              ))}
            </ImageSlider>
            <br />
            <div
              aria-hidden="true"
              className="text-button"
              onClick={() => router.goBack()}
            >
              {`< ${intl.formatMessage({
                id: 'back',
                defaultMessage: 'Go bakc',
              })}`}
            </div>
          </>
        ),
      },
    });
  };

  const tableContent = [
    [
      {
        id: 'air-temperature',
        defaultMessage: 'Air temperature',
        value: airTemperature.sensorValue,
        unit: airTemperature.sensorUnit,
        Component: SensorInfo,
      },
      {
        id: 'road-temperature',
        defaultMessage: 'Road temperature',
        value: roadSurfaceTemperature.sensorValue,
        unit: roadSurfaceTemperature.sensorUnit,
        Component: SensorInfo,
      },
    ],
    [
      {
        id: 'wind-speed',
        defaultMessage: 'Wind speed',
        value: windSpeed.sensorValue,
        unit: windSpeed.sensorUnit,
        Component: SensorInfo,
      },
      {
        id: 'wind-direction',
        defaultMessage: 'Wind direction',
        value: (
          <FormattedMessage
            id={getWindDirection(windDirection.sensorValue)}
            defaultMessage="North"
          >
            {(...content) => `${content} `}
          </FormattedMessage>
        ),
        unit: `${windDirection.sensorValue}°`,
        Component: SensorInfo,
      },
    ],
    [
      {
        id: 'air-humidity',
        defaultMessage: 'Air humidity',
        value: airRelativeHumidity.sensorValue,
        unit: '%',
        Component: SensorInfo,
      },
      {
        id: 'rainfall-depth',
        defaultMessage: 'Rainfall depth',
        value: rainfallDepth.sensorValue,
        unit: rainfallDepth.sensorUnit,
        Component: SensorInfo,
      },
    ],
    [
      {
        id: 'snow-depth',
        defaultMessage: 'snow-depth',
        value: snowDepth.sensorValue,
        unit: snowDepth.sensorUnit,
        Component: SensorInfo,
      },
      {
        id: 'camera',
        onClick: openCameraModal,
        Component: CameraIcon,
      },
    ],
  ];

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'city-weather-station',
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
                  const { id, Component } = obj;
                  return <Component key={id} {...obj} />;
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
    <p>RendTimeers content of a roadwork popup or modal</p>
    <ComponentUsageExample description="">
      <CityWeatherStationContentTable comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

CityWeatherStationContentTable.propTypes = {
  cityWeatherStation: PropTypes.object.isRequired,
  getWindDirection: PropTypes.func.isRequired,
  toggleView: PropTypes.func.isRequired,
};

CityWeatherStationContentTable.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
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
      cityWeatherStation: () => Relay.QL`
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
