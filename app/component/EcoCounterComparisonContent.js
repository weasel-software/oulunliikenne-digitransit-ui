import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import moment from 'moment';
import get from 'lodash/get';
import { DayPickerSingleDateController } from 'react-dates';

import LineChart from './LineChart';
import Icon from './Icon';
import EcoCounterComparisonDatesSelector from './EcoCounterComparisonDatesSelector';

export const WALKING = 1;
export const CYCLING = 2;
const STEPS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const siteDataShape = PropTypes.shape({
  date: PropTypes.string,
  counts: PropTypes.number,
  status: PropTypes.number,
});

const channelShape = PropTypes.shape({
  siteData: PropTypes.arrayOf(siteDataShape),
});

class EcoCounterComparisonContent extends React.Component {
  static propTypes = {
    range1: PropTypes.arrayOf(PropTypes.object).isRequired,
    range2: PropTypes.arrayOf(PropTypes.object).isRequired,
    range1channel1: channelShape.isRequired,
    range1channel2: channelShape,
    range2channel1: channelShape.isRequired,
    range2channel2: channelShape,
    channel1Id: PropTypes.string.isRequired,
    channel2Id: PropTypes.string,
    channels: PropTypes.array.isRequired,
    changeUserType: PropTypes.func.isRequired,
    changeStep: PropTypes.func.isRequired,
    userType: PropTypes.number.isRequired,
    step: PropTypes.string.isRequired,
    formatMessage: PropTypes.func.isRequired,
    availableUserTypes: PropTypes.array.isRequired,
    changeRange1: PropTypes.func.isRequired,
    changeRange2: PropTypes.func.isRequired,
    toggleView: PropTypes.func.isRequired,
  };

  static defaultProps = {
    range1channel2: null,
    range2channel2: null,
    channel2Id: null,
  };

  onTitleClick = () => {
    this.setState({
      isDatePickerOpen: !this.state.isDatePickerOpen,
    });
  };

  getChannelDirection = id => {
    const { channels } = this.props;
    const channel = channels.find(c => c.id === id);

    if (!channel) {
      return 5;
    }

    return get(channel, 'direction', 5);
  };

  formatDateByStep = date => {
    const { step } = this.props;
    const m = moment(date);
    if (step === STEPS.HOUR) {
      return m.format('HH:mm');
    } else if (step === STEPS.DAY) {
      return m.format('DD.MM.');
    } else if (step === STEPS.WEEK) {
      return m.format('DD.MM.');
    }
    return m.format('MMM');
  };

  render() {
    const {
      range1channel1,
      range1channel2,
      range2channel1,
      range2channel2,
      channel1Id,
      channel2Id,
      changeUserType,
      changeStep,
      userType,
      step,
      formatMessage,
      availableUserTypes,
      range1,
      range2,
      changeRange1,
      changeRange2,
    } = this.props;

    const range1labels = get(range1channel1, 'siteData', []).map(data =>
      this.formatDateByStep(data.date),
    );
    const range2labels = get(range2channel1, 'siteData', []).map(data =>
      this.formatDateByStep(data.date),
    );
    const range1channel1Counts = get(range1channel1, 'siteData', []).map(
      ({ counts }) => (!counts ? 0 : counts),
    );
    const range2channel1Counts = get(range2channel1, 'siteData', []).map(
      ({ counts }) => (!counts ? 0 : counts),
    );
    const range1datasets = [
      {
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel1Id)}`,
        }),
        data: range1channel1Counts,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(0,0,0,0)',
      },
    ];
    const range2datasets = [
      {
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel1Id)}`,
        }),
        data: range2channel1Counts,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(0,0,0,0)',
      },
    ];

    if (range1channel2) {
      const range1channel2Counts = get(range1channel2, 'siteData', []).map(
        ({ counts }) => (!counts ? 0 : counts),
      );
      const range2channel2Counts = get(range2channel2, 'siteData', []).map(
        ({ counts }) => (!counts ? 0 : counts),
      );
      range1datasets.push({
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel2Id)}`,
        }),
        data: range1channel2Counts,
        borderColor: '#00AFFF',
        backgroundColor: 'rgba(0,0,0,0)',
      });
      range2datasets.push({
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel2Id)}`,
        }),
        data: range2channel2Counts,
        borderColor: '#00AFFF',
        backgroundColor: 'rgba(0,0,0,0)',
      });
    }

    return (
      <div className="eco-counter-content">
        <EcoCounterComparisonDatesSelector
          range1={range1}
          range2={range2}
          onRange1Change={newRange => {
            this.props.changeRange1(newRange);
          }}
          onRange2Change={newRange => {
            this.props.changeRange2(newRange);
          }}
          onComparisonToggleClick={() => {
            console.log('comparison toggle clicked');
          }}
          formatMessage={formatMessage}
          toggleView={this.props.toggleView}
        />
        <LineChart
          datasets={range1datasets}
          labels={range1labels}
          title="Test"
        />
        <LineChart
          datasets={range2datasets}
          labels={range2labels}
          title="Test"
        />
        <div className="button-row">
          {availableUserTypes.includes(WALKING) && (
            <EcoCounterButton
              condition={userType === WALKING}
              onClick={() => changeUserType(WALKING)}
            >
              <Icon img="icon-icon_walk" viewBox="0 0 25 25" />
            </EcoCounterButton>
          )}
          {availableUserTypes.includes(CYCLING) && (
            <EcoCounterButton
              condition={userType === CYCLING}
              onClick={() => changeUserType(CYCLING)}
            >
              <Icon img="icon-icon_bicycle-withoutBox" viewBox="0 0 25 25" />
            </EcoCounterButton>
          )}
        </div>
        <div className="button-row">
          <EcoCounterButton
            condition={step === STEPS.HOUR}
            onClick={() => changeStep(STEPS.HOUR)}
            isSmall
          >
            {formatMessage({ id: 'hourly' })}
          </EcoCounterButton>
          <EcoCounterButton
            condition={step === STEPS.DAY}
            onClick={() => changeStep(STEPS.DAY)}
            isSmall
          >
            {formatMessage({ id: 'daily' })}
          </EcoCounterButton>
          <EcoCounterButton
            condition={step === STEPS.WEEK}
            onClick={() => changeStep(STEPS.WEEK)}
            isSmall
          >
            {formatMessage({ id: 'weekly' })}
          </EcoCounterButton>
          <EcoCounterButton
            condition={step === STEPS.MONTH}
            onClick={() => changeStep(STEPS.MONTH)}
            isSmall
          >
            {formatMessage({ id: 'monthly' })}
          </EcoCounterButton>
        </div>
      </div>
    );
  }
}

const EcoCounterButton = ({ condition, isSmall, children, onClick }) => (
  <button
    className={cx('eco-counter-button', {
      'eco-counter-button--small': isSmall,
      'eco-counter-button--active': condition,
    })}
    onClick={onClick}
  >
    {children}
  </button>
);

EcoCounterButton.propTypes = {
  condition: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  isSmall: PropTypes.bool,
};

EcoCounterButton.defaultProps = {
  isSmall: false,
};

const ConnectedComponent = Relay.createContainer(EcoCounterComparisonContent, {
  initialVariables: {
    channel1Id: null,
    channel2Id: null,
    domain: null,
    step: null,
    range1begin: null,
    range1end: null,
    range2begin: null,
    range2end: null,
  },
  fragments: {
    range1channel1: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel1Id, 
          domain: $domain, 
          step: $step, 
          begin: $range1begin, 
          end: $range1end
        ) {        
          date
          counts
          status
        }
      }
    `,
    range1channel2: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel2Id, 
          domain: $domain, 
          step: $step, 
          begin: $range1begin, 
          end: $range1end
        ) {        
          date
          counts
          status
        }
      }
    `,
    range2channel1: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel1Id, 
          domain: $domain, 
          step: $step, 
          begin: $range2begin, 
          end: $range2end
        ) {        
          date
          counts
          status
        }
      }
    `,
    range2channel2: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel2Id, 
          domain: $domain, 
          step: $step, 
          begin: $range2begin, 
          end: $range2end
        ) {        
          date
          counts
          status
        }
      }
    `,
  },
});

export {
  ConnectedComponent as default,
  EcoCounterComparisonContent as Component,
  EcoCounterButton,
};
