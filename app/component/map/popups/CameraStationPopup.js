import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { FormattedMessage, intlShape } from 'react-intl';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ImageSlider from '../../ImageSlider';
import ComponentUsageExample from '../../ComponentUsageExample';

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
function CameraStationPopup({ camera, lang }, { intl }) {
  const localName = camera.names[lang] || camera.name;

  const cameraPresets = camera.presets.filter(
    item => moment().diff(moment(item.measuredTime), 'hours') < 24,
  );

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
        {isEmpty(cameraPresets) ? (
          <div className="card-empty">
            <FormattedMessage
              id="traffic-camera-no-recent-images"
              defaultMessage="No recent images"
            />
          </div>
        ) : (
          <ImageSlider>
            {cameraPresets.map(item => (
              <figure className="slide" key={item.presetId}>
                <figcaption>
                  {item.presentationName}
                  {item.measuredTime &&
                    ` (${moment(item.measuredTime).format('HH:mm:ss')})`}
                </figcaption>
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
        )}
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
  camera: PropTypes.object,
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
      camera: () => Relay.QL`
        fragment on CameraInterface {
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
          __typename
        }
      `,
    },
  },
);
