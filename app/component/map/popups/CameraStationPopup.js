import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ImageSlider from '../../ImageSlider';
import ComponentUsageExample from '../../ComponentUsageExample';

function CameraStationPopup({ lang, name, names, presets }, { intl }) {
  presets = (typeof presets === 'string') ? JSON.parse(presets) : presets;
  names = (typeof names === 'string') ? JSON.parse(names) : names;
  const localName = (names[lang] || name);

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'traffic-camera',
            defaultMessage: 'Traffic camera',
          })}
          description={localName}
          icon='icon-icon_camera-station'
          unlinked
        />
        <ImageSlider>
          {presets.map((item, index) => (
            <figure className="slide" key={item.presetId}>
              <figcaption>{item.presentationName}</figcaption>
              <img src={item.imageUrl} alt={item.presentationName}/>
            </figure>
          ))}
        </ImageSlider>
      </Card>
    </div>
  );
};

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
  name: PropTypes.string.isRequired,
  //names: PropTypes.string.isRequired,
  //presets: PropTypes.string.isRequired,
};

CameraStationPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default connectToStores(CameraStationPopup, ['PreferencesStore'], context => ({
  lang: context.getStore('PreferencesStore').getLanguage(),
}));
