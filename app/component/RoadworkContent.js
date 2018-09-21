import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import CityBikeAvailability from './CityBikeAvailability';
import CityBikeUse from './CityBikeUse';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const RoadworkContent = ({ message }) => (
  <div className="roadwork-container pre">
    <p>{message}</p>
  </div>
);

RoadworkContent.displayName = 'RoadworkContent';

RoadworkContent.description = () => (
  <div>
    <p>Renders content of a roadwork card</p>
    <ComponentUsageExample description="">
      <RoadworkContent message={exampleLang} />
    </ComponentUsageExample>
  </div>
);

RoadworkContent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default RoadworkContent;
