/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import moment from 'moment';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import CityWeatherStationContent from '../../CityWeatherStationContent';
import ImageSlider from '../../ImageSlider';
import CityWeatherStationContentList from '../../CityWeatherStationContentList';

class CityWeatherStationPopup extends React.Component {
  static description = (
    <div>
      <p>Renders a city weather station popup.</p>
      <ComponentUsageExample description="">
        {/*
        TODO
        <CityWeatherStationPopup context="context object here" />
        */}
      </ComponentUsageExample>
    </div>
  );

  static propTypes = {
    lang: PropTypes.string.isRequired,
    station: PropTypes.object.isRequired,
  };

  static contextTypes = {
    config: PropTypes.object,
    intl: intlShape.isRequired,
    router: routerShape.isRequired,
    location: locationShape.isRequired,
  };

  static displayName = 'CityWeatherStationPopup';

  constructor(props) {
    super(props);
    this.state = {
      showList: false,
    };
  }

  getWindDirection = degrees => {
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

  openCameraModal = (router, location, localName, cameras) => {
    router.push({
      ...location,
      state: {
        ...location.state,
        moreInfoModalOpen: true,
        moreInfoModalTitle: localName,
        moreInfoModalContent: (
          <ImageSlider>
            {cameras.map(item => (
              <figure className="slide" key={item.presetId}>
                <img
                  src={item.imageUrl}
                  alt={item.presentationName}
                  onClick={() => {
                    window.open(item.imageUrl, '_blank');
                  }}
                />
              </figure>
            ))}
          </ImageSlider>
        ),
      },
    });
  };

  toggleSimplified = () => {
    this.setState({
      showList: !this.state.showList,
    });
  };

  render() {
    const { station, lang } = this.props;
    const { showList } = this.state;
    const { intl, location, router } = this.context;
    const localName = station.name;
    const { measuredTime } = station.sensorValues[0];

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

          {!showList && (
            <CityWeatherStationContent
              sensors={station.sensorValues}
              cameras={station.cameras}
              openCameraModal={() =>
                this.openCameraModal(
                  router,
                  location,
                  localName,
                  station.cameras,
                )
              }
              getWindDirection={this.getWindDirection}
              lang={lang}
            />
          )}
          {showList && (
            <CityWeatherStationContentList
              sensors={station.sensorValues}
              lang={lang}
            />
          )}
          <table className="component-list">
            <tbody>
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
                    onClick={() => this.toggleSimplified()}
                  >
                    {!showList
                      ? `${intl.formatMessage({
                          id: 'show-information-as-list',
                          defaultMessage: 'Show information as list',
                        })} >`
                      : ''}
                    {showList
                      ? `< ${intl.formatMessage({
                          id: 'back',
                          defaultMessage: 'Show information as list',
                        })}`
                      : ''}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    );
  }
}

export default Relay.createContainer(
  connectToStores(CityWeatherStationPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
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
