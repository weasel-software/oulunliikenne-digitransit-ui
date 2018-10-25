import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const DisorderContent = ({ comment, start, end, type }) => {
  const startFormated = start ? moment(start).format('DD.MM.YYYY') : '';
  const endFormated = end ? moment(end).format('DD.MM.YYYY') : '';

  return (
    <div className="disorder-container">
      <div className="insident-info">
        {type && <span className="description">{type}</span>}
        <span className="duration">
          <FormattedMessage
            id="disruption-duration"
            values={{ start: startFormated, end: endFormated }}
            defaultMessage="Duration {start} - {end}"
          >
            {(...content) => content}
          </FormattedMessage>
        </span>
      </div>
      <p className="insident-message">{comment}</p>
    </div>
  );
};

DisorderContent.displayName = 'DisorderContent';

DisorderContent.description = (
  <div>
    <p>Renders content of a disorder popup or modal</p>
    <ComponentUsageExample description="">
      <DisorderContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

DisorderContent.propTypes = {
  comment: PropTypes.string.isRequired,
  start: PropTypes.string,
  end: PropTypes.string,
  type: PropTypes.string,
};

export default DisorderContent;
