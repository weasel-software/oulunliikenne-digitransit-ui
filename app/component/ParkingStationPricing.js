import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';

import ComponentUsageExample from './ComponentUsageExample';

const ParkingStationPricing = (
  { pricing, currentLanguage },
  { config: { defaultLanguage } },
) => {
  if (pricing && Array.isArray(pricing) && pricing.length) {
    return (
      <table className="pricing-list">
        <tbody>
          {pricing.map((item, key) => (
            <tr key={key}>
              <td>
                {item.title[currentLanguage] || item.title[defaultLanguage]}
              </td>
              <td>
                {item.value[currentLanguage] || item.value[defaultLanguage]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
};

ParkingStationPricing.displayName = 'ParkingStationPricing';

ParkingStationPricing.description = (
  <div>
    <p>Renders pricing for a ParkingStation popup or modal</p>
    <ComponentUsageExample description="">
      <ParkingStationPricing
        pricing={[
          { title: { en: 'Standard fee' }, value: { en: '2,50 € (1st hour)' } },
          { title: { en: 'Fee' }, value: { en: '1,10 € /30 min' } },
        ]}
      />
    </ComponentUsageExample>
  </div>
);

ParkingStationPricing.propTypes = {
  pricing: PropTypes.array,
  currentLanguage: PropTypes.string,
};

ParkingStationPricing.defaultProps = {
  pricing: undefined,
  currentLanguage: '',
};

ParkingStationPricing.contextTypes = {
  config: PropTypes.shape({
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default connectToStores(
  ParkingStationPricing,
  ['PreferencesStore'],
  context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  }),
);
