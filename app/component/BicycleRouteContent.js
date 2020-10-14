import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const BicycleRouteContentRow = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>
      <span>{value}</span>
    </td>
  </tr>
);

BicycleRouteContentRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const BicycleRouteContent = ({ name, length, year }, { intl }) => {
  return (
    <div className="roadsign-container">
      <table className="component-list">
        <tbody>
          {name && (
            <BicycleRouteContentRow
              label={intl.formatMessage({
                id: 'bicycle-route-prop-name',
              })}
              value={name}
            />
          )}
          {year && (
            <BicycleRouteContentRow
              label={intl.formatMessage({
                id: 'bicycle-route-prop-year',
              })}
              value={`${year}`}
            />
          )}
          {length && (
            <BicycleRouteContentRow
              label={intl.formatMessage({
                id: 'bicycle-route-prop-length',
              })}
              value={`${length} m`}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};

BicycleRouteContent.displayName = 'BicycleRouteContent';

BicycleRouteContent.description = (
  <div>
    <p>Renders content of a bicycle route popup or modal</p>
    <ComponentUsageExample description="">
      <BicycleRouteContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

BicycleRouteContent.propTypes = {
  name: PropTypes.string,
  length: PropTypes.number,
  year: PropTypes.number,
};

BicycleRouteContent.defaultProps = {
  name: undefined,
  length: undefined,
  year: undefined,
};

BicycleRouteContent.contextTypes = {
  intl: intlShape.isRequired,
};

export default BicycleRouteContent;
