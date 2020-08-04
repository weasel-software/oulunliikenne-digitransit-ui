import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import BicycleRouteContent from '../../BicycleRouteContent';
import { getBicycleRouteKey } from '../../../util/bicycleRouteUtils';
import { BicycleRouteLines } from '../../../constants';

const BicycleRoutePopup = (props, { intl }) => {
  const routeKey = getBicycleRouteKey(props.layer, props.type);

  if (routeKey) {
    const color = BicycleRouteLines[routeKey]
      ? BicycleRouteLines[routeKey].color
      : undefined;
    return (
      <div className="card">
        <Card className="padding-small">
          <CardHeader
            name={intl.formatMessage({
              id: `bicycle-routes-${routeKey}`,
              defaultMessage: 'Bicycle route',
            })}
            description="null"
            icon="icon-icon_bicycle-withoutBox"
            iconColor={color}
            unlinked
          />
          <BicycleRouteContent {...props} />
        </Card>
      </div>
    );
  }
  return null;
};

BicycleRoutePopup.displayName = 'BicycleRoutePopup';

BicycleRoutePopup.description = (
  <div>
    <p>Renders a bicycle route popup.</p>
    <ComponentUsageExample description="">
      <BicycleRoutePopup context="context object here" />
    </ComponentUsageExample>
  </div>
);

BicycleRoutePopup.propTypes = {};

BicycleRoutePopup.contextTypes = {
  intl: intlShape.isRequired,
};

export default BicycleRoutePopup;
