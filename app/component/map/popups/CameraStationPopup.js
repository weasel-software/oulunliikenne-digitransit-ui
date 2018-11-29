import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import moment from 'moment';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ImageSlider from '../../ImageSlider';
import ComponentUsageExample from '../../ComponentUsageExample';

function CameraStationPopup({ weatherCamera, trafficCamera, lang }, { intl }) {
  const camera = weatherCamera || trafficCamera;
  const localName = camera.names[lang] || camera.name;

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'traffic-camera',
            defaultMessage: 'Traffic camera',
          })}
          description={localName}
          icon="icon-icon_camera-station"
          unlinked
        />
        <ImageSlider>
          {camera.presets.map(item => {
            return (
              <figure className="slide" key={item.presetId}>
                <figcaption>
                  {item.presentationName}
                  {item.measuredTime &&
                    ` (${moment(item.measuredTime).format('HH:mm:ss')})`}
                </figcaption>
                <img src={item.imageUrl} alt={item.presentationName} />
              </figure>
            );
          })}
        </ImageSlider>
      </Card>
    </div>
  );
}

CameraStationPopup.displayName = 'CameraStationPopup';

CameraStationPopup.description = (
  <div>
    <p>Renders a camera station popup.</p>
    <ComponentUsageExample description="">
      <CameraStationPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

CameraStationPopup.propTypes = {
  lang: PropTypes.string.isRequired,
  weatherCamera: PropTypes.object,
  trafficCamera: PropTypes.object,
};

CameraStationPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(
  connectToStores(CameraStationPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      weatherCamera: () => Relay.QL`
        fragment on WeatherCamera {
          cameraId
          name
          names {
            fi
            sv
            en
          }
          presets {
      			presetId
            presentationName
            imageUrl
            direction
            measuredTime
          }
        }
      `,
      trafficCamera: () => Relay.QL`
        fragment on TrafficCamera {
          cameraId
          name
          names {
            fi
            sv
            en
          }
          presets {
      			presetId
            presentationName
            imageUrl
            direction
            measuredTime
          }
        }
      `,
    },
  },
);
