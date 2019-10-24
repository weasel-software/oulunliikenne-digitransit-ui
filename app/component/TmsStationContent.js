import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const TmsStationContent = ({
  sensors,
  measuredTime,
  // eslint-disable-next-line react/prop-types
  direction1,
  // eslint-disable-next-line react/prop-types
  direction2,
}) => {
  const speedSensor1 = sensors.find(
    item => item.name === 'KESKINOPEUS_5MIN_LIUKUVA_SUUNTA1',
  );
  const speedSensor2 = sensors.find(
    item => item.name === 'KESKINOPEUS_5MIN_LIUKUVA_SUUNTA2',
  );
  const vechicleCountSensor1 = sensors.find(
    item => item.name === 'OHITUKSET_5MIN_LIUKUVA_SUUNTA1',
  );
  const vechicleCountSensor2 = sensors.find(
    item => item.name === 'OHITUKSET_5MIN_LIUKUVA_SUUNTA2',
  );
  return (
    <table className="component-list">
      <tbody>
        <tr>
          <td colSpan={2}>
            <FormattedMessage
              id="average-speed"
              defaultMessage="Average speed"
            />
          </td>
        </tr>
        {speedSensor1 && (
          <tr>
            <td>{`${direction1}:`}</td>
            <td>{`${speedSensor1.sensorValue} ${speedSensor1.sensorUnit}`}</td>
          </tr>
        )}
        {speedSensor2 && (
          <tr>
            <td>{`${direction2}:`}</td>
            <td>{`${speedSensor2.sensorValue} ${speedSensor2.sensorUnit}`}</td>
          </tr>
        )}
        <tr>
          <td colSpan={2}>
            <FormattedMessage
              id="traffic-count"
              defaultMessage="Traffic count"
            />
          </td>
        </tr>
        {vechicleCountSensor1 && (
          <tr>
            <td>{`${direction1}:`}</td>
            <td>
              {`${vechicleCountSensor1.sensorValue} ${
                vechicleCountSensor1.sensorUnit
              }`}
            </td>
          </tr>
        )}
        {vechicleCountSensor2 && (
          <tr>
            <td>{`${direction2}:`}</td>
            <td>
              {`${vechicleCountSensor2.sensorValue} ${
                vechicleCountSensor2.sensorUnit
              }`}
            </td>
          </tr>
        )}
        {measuredTime && (
          <tr>
            <td colSpan={2} className="last-updated">
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
