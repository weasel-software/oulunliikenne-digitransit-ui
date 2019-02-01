import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import TmsStationContent from '../../TmsStationContent';
import ComponentUsageExample from '../../ComponentUsageExample';

function TmsStationPopup({ station, lang }, { intl }) {
  const localName = station.names[lang] || station.name;

  console.log({
    sensors: station.sensorValues,
    direction1Municipality: station.direction1Municipality,
    direction1MunicipalityCode: station.direction1MunicipalityCode,
    direction2Municipality: station.direction2Municipality,
    calculatorDeviceType: station.calculatorDeviceType,
  });

  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'traffic-monitoring',
            defaultMessage: 'Traffic monitoring',
          })}
          description={localName}
          icon="icon-icon_tms-station"
          unlinked
        />
        <TmsStationContent
          sensors={station.sensorValues}
          measuredTime={station.measuredTime}
          direction1={station.direction1Municipality}
          direction2={station.direction2Municipality}
        />
      </Card>
    </div>
  );
}

TmsStationPopup.displayName = 'TmsStationPopup';

TmsStationPopup.description = (
  <div>
    <p>Renders a weather station popup.</p>
    <ComponentUsageExample description="">
      <TmsStationPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

TmsStationPopup.propTypes = {
  lang: PropTypes.string.isRequired,
  station: PropTypes.object.isRequired,
};

TmsStationPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(
  connectToStores(TmsStationPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      station: () => Relay.QL`
      fragment on TmsStation {
        tmsStationId
        name
        names {
          fi
          sv
          en
        }
        state
        measuredTime
        sensorValues {
          roadStationId,
          name,
          shortName,
          sensorValue,
          sensorUnit
        }
        direction1Municipality
        direction2Municipality
      }
    `,
    },
  },
);
