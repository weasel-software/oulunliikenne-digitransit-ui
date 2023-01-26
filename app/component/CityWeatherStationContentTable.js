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
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';
import './city-weather-station-container.scss';
import Icon from './Icon';
import Card from './Card';
import CardHeader from './CardHeader';

const CityWeatherStationContentTable = (
  { openCameraModal, getWindDirection, toggleView, station },
  { intl, router, location },
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
                      <tr>
                        <td>{airTemperature.sensorValue}</td>
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
                      <tr>
                        <td>{roadSurfaceTemperature.sensorValue}</td>
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
                      <tr>
                        <td>{windSpeed.sensorValue}</td>
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
                      <tr>
                        <td>
                          <FormattedMessage
                            id={getWindDirection(windDirection.sensorValue)}
                            defaultMessage="North"
                          >
                            {(...content) => `${content}`}
                          </FormattedMessage>
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
                      <tr>
                        <td>{airRelativeHumidity.sensorValue}</td>
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
                        <td>{rainfallDepth.sensorValue}</td>
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
                        <td>{snowDepth.sensorValue}</td>
                      </tr>
                      <tr>
                        <td>{snowDepth.sensorUnit}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              )}
              {cameras && (
                <td>
                  <div
                    className="camera-icon-container"
                    onClick={() =>
                      openCameraModal(router, location, localName, cameras)
                    }
                  >
                    <Icon
                      img="icon-icon_camera-station"
                      className="camera-icon"
                    />
                  </div>
                </td>
              )}
            </tr>
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
                  className="show-as-list"
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
  station: PropTypes.object.isRequired,
  getWindDirection: PropTypes.func.isRequired,
  openCameraModal: PropTypes.func.isRequired,
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
