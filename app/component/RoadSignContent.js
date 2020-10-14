import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';
import { intlShape } from 'react-intl';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const RoadSignContentRow = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>
      <span>{value}</span>
    </td>
  </tr>
);

RoadSignContentRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const RoadSignContent = ({ roadSign }, { intl }) => {
  return (
    <div className="roadsign-container">
      <table className="component-list">
        <tbody>
          {roadSign.type && (
            <RoadSignContentRow
              label={intl.formatMessage({
                id: 'road-sign-type',
              })}
              value={intl.formatMessage({
                id: `road-sign-${roadSign.type}`,
              })}
            />
          )}
          {roadSign.type === 'SPEEDLIMIT' &&
            roadSign.displayValue && (
              <RoadSignContentRow
                label={intl.formatMessage({
                  id: 'road-sign-display-value',
                })}
                value={roadSign.displayValue}
              />
            )}
          {roadSign.type === 'WARNING' &&
            roadSign.displayValue && (
              <RoadSignContentRow
                label={intl.formatMessage({
                  id: 'road-sign-display-value',
                })}
                value={intl.formatMessage({
                  id: `road-sign-warning-${roadSign.displayValue}`,
                })}
              />
            )}
          {roadSign.effectDate && (
            <RoadSignContentRow
              label={intl.formatMessage({
                id: 'road-sign-effective-from',
              })}
              value={moment.utc(roadSign.effectDate).format('DD.MM.YYYY HH:mm')}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};

RoadSignContent.displayName = 'RoadSignContent';

RoadSignContent.description = (
  <div>
    <p>Renders content of a road sign popup or modal</p>
    <ComponentUsageExample description="">
      <RoadSignContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

RoadSignContent.propTypes = {
  roadSign: PropTypes.object.isRequired,
};

RoadSignContent.contextTypes = {
  intl: intlShape.isRequired,
};

export default RoadSignContent;
