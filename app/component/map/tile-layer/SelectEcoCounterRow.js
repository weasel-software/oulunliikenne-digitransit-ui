import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import Icon from '../../Icon';
import ComponentUsageExample from '../../ComponentUsageExample';

const SelectEcoCounterRow = (props, { intl }) => {
  const channels = JSON.parse(props.channels);
  let { name } = props;

  if (channels.length === 1) {
    const direction = intl.formatMessage({
      id: `eco-counter-direction-${channels[0].direction}`,
    });
    name = `${name} ${direction}`;
  }

  return (
    <div className="no-margin">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div className="cursor-pointer select-row" onClick={props.selectRow}>
        <div className="padding-vertical-normal select-row-icon">
          <Icon img="icon-icon_eco-counter" />
        </div>
        <div className="padding-vertical-normal select-row-text">
          <span className="header-primary no-margin link-color">
            {`${name} ›`}
          </span>
        </div>
        <div className="clear" />
      </div>
      <hr className="no-margin gray" />
    </div>
  );
};

SelectEcoCounterRow.displayName = 'SelectEcoCounterRow';

SelectEcoCounterRow.description = (
  <div>
    <p>Renders a select eco counter row</p>
    <ComponentUsageExample description="">
      <SelectEcoCounterRow selectRow={() => {}} />
    </ComponentUsageExample>
  </div>
);

SelectEcoCounterRow.propTypes = {
  selectRow: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  channels: PropTypes.string.isRequired,
};

SelectEcoCounterRow.contextTypes = {
  intl: intlShape,
};

export default SelectEcoCounterRow;
