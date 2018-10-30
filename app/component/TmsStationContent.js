import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const TmsStationContent = ({ sensors, measuredTime }) => {
  const speedSensorA = sensors.find(
    item => item.name === 'KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1',
  );
  const speedSensorB = sensors.find(
    item => item.name === 'KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2',
  );
  const vechicleCountSensorA = sensors.find(
    item => item.name === 'OHITUKSET_5MIN_LIUKUVA_SUUNTA1',
  );
  const vechicleCountSensorB = sensors.find(
    item => item.name === 'OHITUKSET_5MIN_LIUKUVA_SUUNTA2',
  );
  return (
    <table className="component-list">
      <tbody>
        {speedSensorA && (
          <tr>
            <td>
              <FormattedMessage
                id="average-speed"
                defaultMessage="Average speed"
              >
                {(...content) => `${content} A:`}
              </FormattedMessage>
            </td>
            <td>{`${speedSensorA.sensorValue} ${speedSensorA.sensorUnit}`}</td>
          </tr>
        )}
        {speedSensorB && (
          <tr>
            <td>
              <FormattedMessage
                id="average-speed"
                defaultMessage="Average speed"
              >
                {(...content) => `${content} B:`}
              </FormattedMessage>
            </td>
            <td>{`${speedSensorB.sensorValue} ${speedSensorB.sensorUnit}`}</td>
          </tr>
        )}
        {vechicleCountSensorA && (
          <tr>
            <td>
              <FormattedMessage
                id="traffic-count"
                defaultMessage="Traffic count"
              >
                {(...content) => `${content} A:`}
              </FormattedMessage>
            </td>
            <td>
              {`${vechicleCountSensorA.sensorValue} ${
                vechicleCountSensorA.sensorUnit
              }`}
            </td>
          </tr>
        )}
        {vechicleCountSensorB && (
          <tr>
            <td>
              <FormattedMessage
                id="traffic-count"
                defaultMessage="Traffic count"
              >
                {(...content) => `${content} B:`}
              </FormattedMessage>
            </td>
            <td>
              {`${vechicleCountSensorB.sensorValue} ${
                vechicleCountSensorB.sensorUnit
              }`}
            </td>
          </tr>
        )}
        {measuredTime && (
          <tr>
            <td>
              <FormattedMessage id="measure-time" defaultMessage="Measure time">
                {(...content) => `${content}:`}
              </FormattedMessage>
            </td>
            <td>{moment(measuredTime).format('HH:mm:ss') || ''}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

TmsStationContent.displayName = 'TmsStationContent';

TmsStationContent.description = (
  <div>
    <p>Renders content of a tms station popup</p>
    <ComponentUsageExample description="">
      <TmsStationContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

TmsStationContent.propTypes = {
  sensors: PropTypes.array.isRequired,
  measuredTime: PropTypes.string.isRequired,
};

export default TmsStationContent;
