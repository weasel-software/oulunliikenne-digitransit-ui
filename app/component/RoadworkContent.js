import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const RoadworkContent = ({ comment, start, end, type }) => {
  const startFormated = start ? moment(start).format('DD.MM.YYYY') : '';
  const endFormated = end ? moment(end).format('DD.MM.YYYY') : '';

  return (
    <div className="roadwork-container">
      <div className="insident-info">
        {type && <span className="description">{type}</span>}
        <span className="duration">{`${startFormated} - ${endFormated}`}</span>
      </div>
      <p className="insident-message">{comment}</p>
    </div>
  );
};

RoadworkContent.displayName = 'RoadworkContent';

RoadworkContent.description = (
  <div>
    <p>RendTimeers content of a roadwork popup or modal</p>
    <ComponentUsageExample description="">
      <RoadworkContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

RoadworkContent.propTypes = {
  comment: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default RoadworkContent;
