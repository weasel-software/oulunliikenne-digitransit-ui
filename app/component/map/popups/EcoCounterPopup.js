import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';

const EcoCounterPopup = ({ sites }, { intl }) => {
  return (
    <div className="card">
      <Card className="padding-small">
        <CardHeader
          name={intl.formatMessage({
            id: 'eco-counter',
            defaultMessage: 'Eco counter',
          })}
          description={sites[0].name}
          icon="icon-icon_eco-counter"
          unlinked
        />
      </Card>
    </div>
  );
};

EcoCounterPopup.displayName = 'EcoCounterPopup';

EcoCounterPopup.description = (
  <div>
    <p>Renders an eco counter popup.</p>
    <ComponentUsageExample description="">
      <EcoCounterPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

EcoCounterPopup.propTypes = {
  sites: PropTypes.array.isRequired,
};

EcoCounterPopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default Relay.createContainer(
  connectToStores(EcoCounterPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      sites: () => Relay.QL`
        fragment on EcoCounterSite @relay(plural: true) {
          id
          siteId
          name
          domain
          lat
          lon
          channels {
            id
            siteId
            name
            userType
          }
        }
      `,
    },
  },
);
