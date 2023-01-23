/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import CityWeatherStationContent from '../../CityWeatherStationContent';
import ImageSlider from '../../ImageSlider';

function CityWeatherStationPopup(
  { station, lang },
  { intl, router, location },
) {
  const localName = station.name;

  const openCameraModal = cameras => {
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
        <CityWeatherStationContent
          openCameraModal={openCameraModal}
          sensors={station.sensorValues}
          cameras={station.cameras}
          lang={lang}
        />
      </Card>
    </div>
  );
}

CityWeatherStationPopup.displayName = 'CityWeatherStationPopup';

CityWeatherStationPopup.description = (
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

CityWeatherStationPopup.propTypes = {
  lang: PropTypes.string.isRequired,
  station: PropTypes.object.isRequired,
};

CityWeatherStationPopup.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
};

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
