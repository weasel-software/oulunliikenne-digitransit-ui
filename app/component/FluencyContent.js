import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ComponentUsageExample from './ComponentUsageExample';
import { lang as exampleLang } from './ExampleData';

const getFlowTranslation = trafficFlow => {
  switch (trafficFlow) {
    case 'TRAFFIC_FLOW_NORMAL':
      return (
        <FormattedMessage id="traffic-flow-normal" defaultMessage="Normal" />
      );
    case 'TRAFFIC_HEAVIER_THAN_NORMAL':
      return (
        <FormattedMessage id="traffic-flow-medium" defaultMessage="Medium" />
      );
    case 'TRAFFIC_MUCH_HEAVIER_THAN_NORMAL':
      return (
        <FormattedMessage id="traffic-flow-heavy" defaultMessage="Heavy" />
      );
    case 'TRAFFIC_FLOW_UNKNOWN':
    default:
      return (
        <FormattedMessage id="traffic-flow-unknown" defaultMessage="Unknown" />
      );
  }
};

const FluencyContent = ({ trafficFlow, averageSpeed, speedLimit }) => (
  <table className="component-list">
    <tbody>
      {trafficFlow && (
        <tr>
          <td>
            <FormattedMessage id="traffic-flow" defaultMessage="Traffic flow">
              {(...content) => `${content}:`}
            </FormattedMessage>
          </td>
          <td>{getFlowTranslation(trafficFlow)}</td>
        </tr>
      )}
      {averageSpeed && (
        <tr>
          <td>
            <FormattedMessage id="average-speed" defaultMessage="Average speed">
              {(...content) => `${content}:`}
            </FormattedMessage>
          </td>
          <td>{`${averageSpeed} km/h`}</td>
        </tr>
      )}
      {speedLimit && (
        <tr>
          <td>
            <FormattedMessage id="speed-limit" defaultMessage="Speed limit">
              {(...content) => `${content}:`}
            </FormattedMessage>
          </td>
          <td>{`${speedLimit} km/h`}</td>
        </tr>
      )}
    </tbody>
  </table>
);

FluencyContent.displayName = 'FluencyContent';

FluencyContent.description = (
  <div>
    <p>RendTimeers content of a fluency popup or modal</p>
    <ComponentUsageExample description="">
      <FluencyContent comment={exampleLang} />
    </ComponentUsageExample>
  </div>
);

FluencyContent.propTypes = {
  trafficFlow: PropTypes.string,
  averageSpeed: PropTypes.number,
  speedLimit: PropTypes.number,
};

FluencyContent.defaultProps = {
  trafficFlow: null,
  averageSpeed: null,
  speedLimit: null,
};

export default FluencyContent;
