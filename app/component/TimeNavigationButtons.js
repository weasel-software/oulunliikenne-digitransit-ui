import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import Button from 'hsl-shared-components/lib/Button';
import ComponentUsageExample from './ComponentUsageExample';
import { plan as examplePlan } from './ExampleData';
import ItineraryFeedback from './itinerary-feedback';
import Icon from './Icon';

// TODO: sptlit into container and view

class TimeNavigationButtons extends React.Component {
  static propTypes = {
    itineraries: PropTypes.arrayOf(
      PropTypes.shape({
        endTime: PropTypes.number.isRequired,
        startTime: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
    onEarlier: PropTypes.func.isRequired,
    onLater: PropTypes.func.isRequired,
    onNow: PropTypes.func.isRequired,
  };

  static contextTypes = {
    breakpoint: PropTypes.string,
    config: PropTypes.object.isRequired,
  };

  static displayName = 'TimeNavigationButtons';

  static description = () => (
    <div>
      <p>
        Shows buttons for changing the itinerary search time to show previous or
        next deaprtures or reset the time.
      </p>
      <ComponentUsageExample>
        <TimeNavigationButtons itineraries={examplePlan.itineraries} />
      </ComponentUsageExample>
    </div>
  );

  render() {
    const { config } = this.context;
    const small = this.context.breakpoint !== 'large';
    const StyledButton = Button.extend`
      width: 25%;
      margin-right: 5px;
    `;

    if (!this.props.itineraries || !this.props.itineraries[0]) {
      return null;
    }
    const itineraryFeedback = config.itinerary.enableFeedback ? (
      <ItineraryFeedback />
    ) : null;
    const { enableButtonArrows } = config.itinerary.timeNavigation;
    const leftArrow = enableButtonArrows ? (
      <Icon img="icon-icon_arrow-left" className="cursor-pointer back" />
    ) : null;
    const rightArrow = enableButtonArrows ? (
      <Icon img="icon-icon_arrow-right" className="cursor-pointer back" />
    ) : null;

    return (
      <div
        className={cx('time-navigation-buttons', {
          'bp-large': this.context.breakpoint === 'large',
        })}
      >
        {itineraryFeedback}
        <StyledButton onClick={this.props.onEarlier} primary small={small} >
          {leftArrow}
          <FormattedMessage id="earlier" defaultMessage="Earlier" />
        </StyledButton>
        <StyledButton onClick={this.props.onNow} primary small={small} >
          <FormattedMessage id="now" defaultMessage="Now" />
        </StyledButton>
        <StyledButton onClick={this.props.onLater} primary small={small} >
          <FormattedMessage id="later" defaultMessage="Later" />
          {rightArrow}
        </StyledButton>
      </div>
    );
  }
}

export default TimeNavigationButtons;
