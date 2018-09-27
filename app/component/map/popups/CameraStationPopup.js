import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';

function CameraStationPopup({ name, names, presets }, { intl }) {
  presets = (typeof presets === 'string') ? JSON.parse(presets) : presets;
  names = (typeof names === 'string') ? JSON.parse(names) : names;
  const localName = names['fi'];

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
        <div>
          <img src={presets[0].imageUrl} alt={presets[0].presentationName} />
          {/*presets.map(item => (<img src={item.imageUrl} alt={item.presentationName} key={item.presetId} />))*/}
        </div>
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
  name: PropTypes.string.isRequired,
  //names: PropTypes.string.isRequired,
  //presets: PropTypes.string.isRequired,
};

CameraStationPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default CameraStationPopup;
