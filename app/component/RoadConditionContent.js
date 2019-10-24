import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const RoadConditionContent = ({ forecasts, measuredTime }) => (
  <table className="road-condition-content">
    <thead>
      <tr>
        <td>
          <FormattedMessage id="road-condition-time" defaultMessage="Time" />
        </td>
        <td>
          <FormattedMessage
            id="road-condition-weather"
            defaultMessage="Weather"
          />
        </td>
        <td>
          <FormattedMessage id="road-condition-wind" defaultMessage="Wind" />
        </td>
        <td>
          <FormattedMessage id="road-condition-air" defaultMessage="Air" />
        </td>
        <td>
          <FormattedMessage id="road-condition-road" defaultMessage="Road" />
        </td>
        <td>
          <FormattedMessage
            id="road-condition-condition"
            defaultMessage="Condition"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      {forecasts.map(forecast => {
        const overallRoadCondition = {
          NORMAL_CONDITION: 'normal',
          POOR_CONDITION: 'poor',
          EXTREMELY_POOR_CONDITION: 'extremely-poor',
          CONDITION_COULD_NOT_BE_RESOLVED: 'unresolved',
        }[forecast.overallRoadCondition];
        return (
          <tr key={forecast.forecastName}>
            <td>
              {forecast.type === 'OBSERVATION' ? (
                <FormattedMessage
                  id="road-condition-now"
                  defaultMessage="Now"
                />
              ) : (
                forecast.forecastName
              )}
            </td>
            <td>
              <img
                src={`https://corporate.foreca.com/en/uploads/Symbolset-1/${
                  forecast.weatherSymbol
                }.png`}
                style={{ width: '35px' }}
                alt="weather-symbol"
              />
            </td>
            <td>{forecast.windSpeed}</td>
            <td>{forecast.temperature}&deg;</td>
            <td>{forecast.roadTemperature}&deg;</td>
            <td>
              <div
                className={`road-condition-symbol ${overallRoadCondition}`}
              />
            </td>
          </tr>
        );
      })}
      {measuredTime && (
        <tr>
          <td colSpan={6} className="last-updated">
            <FormattedMessage id="last-updated" defaultMessage="Last updated">
              {(...content) => `${content} `}
            </FormattedMessage>
            {moment(measuredTime).format('HH:mm:ss') || ''}
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

RoadConditionContent.displayName = 'TmsStationContent';

RoadConditionContent.description = (
  <div>
    <p>Renders content for a road condition popup</p>
    <ComponentUsageExample description="">
      <RoadConditionContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

RoadConditionContent.propTypes = {
  forecasts: PropTypes.array.isRequired,
  measuredTime: PropTypes.string.isRequired,
};

export default RoadConditionContent;
