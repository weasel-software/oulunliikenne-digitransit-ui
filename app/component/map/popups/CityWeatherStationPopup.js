/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes, { object } from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import ComponentUsageExample from '../../ComponentUsageExample';
import CityWeatherStationContent from '../../CityWeatherStationContent';
import ImageSlider from '../../ImageSlider';
import CityWeatherStationContentList from '../../CityWeatherStationContentList';
import CityWeatherStationRoute from '../../../route/CityWeatherStationRoute';
import Card from '../../Card';
import CardHeader from '../../CardHeader';

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
    id: PropTypes.string.isRequired,
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

  toggleView = () => {
    this.setState({
      showList: !this.state.showList,
    });
  };

  render() {
    const { id } = this.props;
    const { intl } = this.context;
    const { showList } = this.state;
    const queryConfig = new CityWeatherStationRoute({ id });

    return (
      <Relay.Renderer
        Container={
          showList ? CityWeatherStationContentList : CityWeatherStationContent
        }
        queryConfig={queryConfig}
        environment={Relay.Store}
        render={stuff => {
          const { done, error, props } = stuff;
          if (done) {
            return showList ? (
              <CityWeatherStationContentList
                toggleView={this.toggleView}
                {...props}
              />
            ) : (
              <CityWeatherStationContent
                getWindDirection={this.getWindDirection}
                openCameraModal={this.openCameraModal}
                toggleView={this.toggleView}
                {...props}
              />
            );
          }

          if (!done) {
            return (
              <InformationContainer {...props}>
                <div className="spinner-loader" />
              </InformationContainer>
            );
          }

          if (error) {
            return (
              <InformationContainer {...props}>
                {intl.formatMessage({
                  id: 'generic-error',
                  defaultMessage: 'There was an error',
                })}
              </InformationContainer>
            );
          }

          return null;
        }}
      />
    );
  }
}

const InformationContainer = ({ children }, { intl }) => (
  <div className="card">
    <Card className="padding-small">
      <CardHeader
        name={intl.formatMessage({
          id: 'city-weather-station',
          defaultMessage: 'Weather station',
        })}
        description=""
        icon="icon-icon_weather-station"
        unlinked
      />
      <div className="information-container">{children}</div>
    </Card>
  </div>
);

InformationContainer.propTypes = {
  children: object.isRequired,
};

InformationContainer.contextTypes = {
  intl: intlShape.isRequired,
};

export default CityWeatherStationPopup;
