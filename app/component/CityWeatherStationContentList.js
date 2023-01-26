/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import { FormattedMessage, intlShape } from 'react-intl';
import { connectToStores } from 'fluxible-addons-react';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';
import Card from './Card';
import CardHeader from './CardHeader';

const CityWeatherStationContentList = ({ toggleView, station }, { intl }) => {
  const { sensorValues } = station;
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
                  <FormattedMessage
                    id="air-humidity"
                    defaultMessage="Air humidity"
                  >
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
            {measuredTime && (
              <tr>
                <td colSpan={2} className="last-updated">
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
              <td colSpan={2} className="last-updated">
                <div
                  aria-hidden="true"
                  className="show-as-list"
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
