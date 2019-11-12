import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import FluencyContent from '../../FluencyContent';
import {
  setHighlightedFluency,
  removeHighlightedFluency,
} from '../../../action/MapLayerActions';

class FluencyPopup extends React.Component {
  componentDidMount() {
    const { name, trafficDirection, detName } = this.props;

    if (name) {
      this.context.executeAction(
        setHighlightedFluency,
        trafficDirection ? `${name}_${trafficDirection}` : `${name}_${detName}`,
      );
    }
  }

  componentWillUnmount() {
    this.context.executeAction(removeHighlightedFluency);
  }

  render() {
    const {
      name,
      averageSpeed,
      trafficFlow,
      trafficDirectionName,
      measuredTime,
    } = this.props;
    const { intl } = this.context;
    return (
      <div className="card">
        <Card className="padding-small">
          <CardHeader
            name={intl.formatMessage({
              id: 'fluency',
              defaultMessage: 'Fluency',
            })}
            description={name}
            icon="icon-icon_fluency"
            unlinked
          />
          <FluencyContent
            averageSpeed={averageSpeed}
            trafficFlow={trafficFlow}
            trafficDirectionName={trafficDirectionName}
            measuredTime={measuredTime}
          />
        </Card>
      </div>
    );
  }
}

FluencyPopup.description = (
  <div>
    <p>Renders a fluency popup.</p>
    <ComponentUsageExample description="">
      <FluencyPopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

FluencyPopup.propTypes = {
  name: PropTypes.string.isRequired,
  detName: PropTypes.string,
  trafficDirection: PropTypes.number,
  trafficDirectionName: PropTypes.string,
  trafficFlow: PropTypes.string,
  averageSpeed: PropTypes.number,
  measuredTime: PropTypes.string,
};

FluencyPopup.defaultProps = {
  detName: undefined,
  trafficDirection: undefined,
  trafficDirectionName: null,
  trafficFlow: null,
  averageSpeed: null,
  measuredTime: null,
};

FluencyPopup.contextTypes = {
  intl: intlShape.isRequired,
  executeAction: PropTypes.func.isRequired,
};

export default FluencyPopup;
