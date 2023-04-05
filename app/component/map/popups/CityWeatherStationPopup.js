/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes, { func, object } from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { FormattedMessage, intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';
import { isEmpty } from 'lodash';
import ComponentUsageExample from '../../ComponentUsageExample';
import CityWeatherStationContentTable from '../../CityWeatherStationContentTable';
import CityWeatherStationContentList from '../../CityWeatherStationContentList';
import CityWeatherStationRoute from '../../../route/CityWeatherStationRoute';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ImageSlider from '../../ImageSlider';

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
      showImageView: false,
      cameraInfo: null,
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

  toggleView = () => {
    this.setState({
      showList: !this.state.showList,
    });
  };

  toggleImageView = cameraInfo => {
    this.setState({
      showImageView: !this.state.showImageView,
      cameraInfo,
    });
  };

  render() {
    const { id } = this.props;
    const { intl } = this.context;
    const { showList, showImageView, cameraInfo } = this.state;
    const queryConfig = new CityWeatherStationRoute({ id });
    return (
      <Relay.Renderer
        Container={
          showList
            ? CityWeatherStationContentList
            : CityWeatherStationContentTable
        }
        queryConfig={queryConfig}
        environment={Relay.Store}
        render={({ done, error, props }) => {
          if (done) {
            if (showImageView && cameraInfo) {
              return (
                <ImageViewContainer
                  cameraInfo={cameraInfo}
                  toggleImageView={this.toggleImageView}
                />
              );
            }
            return showList ? (
              <CityWeatherStationContentList
                toggleView={this.toggleView}
                getWindDirection={this.getWindDirection}
                {...props}
              />
            ) : (
              <CityWeatherStationContentTable
                getWindDirection={this.getWindDirection}
                toggleImageView={this.toggleImageView}
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

const ImageViewContainer = ({ cameraInfo, toggleImageView }, { intl }) => (
  <div className="card">
    <Card className="padding-small">
      <CardHeader
        name={intl.formatMessage({
          id: 'weather-station',
          defaultMessage: 'City weather station',
        })}
        description={cameraInfo.localName}
        icon="icon-icon_camera-station"
      />
      {isEmpty(cameraInfo.cameras) ? (
        <div className="card-empty">
          <FormattedMessage
            id="traffic-camera-no-recent-images"
            defaultMessage="No recent images"
          />
        </div>
      ) : (
        <ImageSlider>
          {cameraInfo.cameras.map(item => (
            <figure className="slide" key={item.cameraId}>
              <figcaption>{cameraInfo.localName}</figcaption>
              <img
                src={item.imageUrl}
                alt={cameraInfo.localName}
                onClick={() => {
                  window.open(item.imageUrl, '_blank');
                }}
              />
            </figure>
          ))}
        </ImageSlider>
      )}
      <br />
      <div
        aria-hidden="true"
        className="text-button"
        onClick={() => toggleImageView(null)}
      >
        {`< ${intl.formatMessage({
          id: 'back',
          defaultMessage: 'Go back',
        })}`}
      </div>
    </Card>
  </div>
);

ImageViewContainer.propTypes = {
  cameraInfo: object.isRequired,
  toggleImageView: func.isRequired,
};

ImageViewContainer.contextTypes = {
  intl: intlShape.isRequired,
};

const InformationContainer = ({ children }, { intl }) => (
  <div className="card">
    <Card className="padding-small">
      <CardHeader
        name={intl.formatMessage({
          id: 'weather-station',
          defaultMessage: 'City weather station',
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
