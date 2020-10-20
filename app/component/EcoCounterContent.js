import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import moment from 'moment';
import get from 'lodash/get';
import { DayPickerSingleDateController } from 'react-dates';
import { routerShape, locationShape } from 'react-router';

import LineChart from './LineChart';
import Icon from './Icon';

import { combineEcoCounterCounts } from '../util/ecoCounterUtils';

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

class EcoCounterContent extends React.Component {
  static propTypes = {
    date: PropTypes.object.isRequired,
    channel1: channelShape.isRequired,
    channel2: channelShape,
    channel1Id: PropTypes.string.isRequired,
    channel2Id: PropTypes.string,
    channels: PropTypes.array.isRequired,
    changeDate: PropTypes.func.isRequired,
    changeUserType: PropTypes.func.isRequired,
    changeStep: PropTypes.func.isRequired,
    userType: PropTypes.number.isRequired,
    step: PropTypes.string.isRequired,
    formatMessage: PropTypes.func.isRequired,
    availableUserTypes: PropTypes.array.isRequired,
    toggleView: PropTypes.func.isRequired,
    renderMonthElement: PropTypes.func,
    openComparison: PropTypes.func,
  };

  static contextTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,
  };

  static defaultProps = {
    channel2: null,
    channel2Id: null,
    renderMonthElement: null,
  };

  state = {
    isDatePickerOpen: false,
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

  getTitle = () => {
    const { step, date, formatMessage } = this.props;

    switch (step) {
      case STEPS.HOUR:
        return date.format('D.M.Y');
      case STEPS.DAY:
        return formatMessage(
          {
            id: 'eco-counter-week-title',
          },
          {
            date: date.format('GG, YYYY'),
          },
        );
      case STEPS.WEEK:
        return date.format('MMMM, YYYY');
      case STEPS.MONTH:
        return date.format('YYYY');
      default:
        return '';
    }
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
      channel1,
      channel2,
      channel1Id,
      channel2Id,
      changeDate,
      changeUserType,
      changeStep,
      date,
      userType,
      step,
      formatMessage,
      availableUserTypes,
      openComparison,
      renderMonthElement,
    } = this.props;
    const { isDatePickerOpen } = this.state;

    const labels = get(channel1, 'siteData', []).map(data =>
      this.formatDateByStep(data.date),
    );

    const channel1Counts = get(channel1, 'siteData', []).map(
      ({ counts }) => (!counts ? 0 : counts),
    );

    const datasets = [
      {
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel1Id)}`,
        }),
        data: channel1Counts,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(0,0,0,0)',
        hidden: true,
      },
    ];

    let channel2Counts = [];

    if (channel2) {
      channel2Counts = get(channel2, 'siteData', []).map(
        ({ counts }) => (!counts ? 0 : counts),
      );

      datasets.push({
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel2Id)}`,
        }),
        data: channel2Counts,
        borderColor: '#00AFFF',
        backgroundColor: 'rgba(0,0,0,0)',
        hidden: true,
      });
    }

    const channelTotals = combineEcoCounterCounts([
      channel1Counts,
      channel2Counts,
    ]);

    if (channelTotals && channelTotals.length > 0) {
      datasets.push({
        label: formatMessage({
          id: 'eco-counter-total',
        }),
        data: channelTotals,
        borderColor: '#FFC107',
        backgroundColor: 'rgba(0,0,0,0)',
        hidden: false,
      });
    }

    return (
      <div className="eco-counter-content">
        <div className="eco-counter-content__title">
          <h5>
            <button onClick={this.onTitleClick}>{this.getTitle()}</button>
            <button onClick={openComparison}>
              {formatMessage({ id: 'compare' })}
              <Icon img="icon-icon_arrow-collapse--right" viewBox="0 0 25 25" />
            </button>
          </h5>
          {isDatePickerOpen && (
            <div className="eco-counter-content__date-picker">
              <DayPickerSingleDateController
                date={date}
                onDateChange={newDate => {
                  changeDate(newDate);
                  this.setState({ isDatePickerOpen: false });
                }}
                numberOfMonths={1}
                renderMonthElement={renderMonthElement}
              />
            </div>
          )}
        </div>
        <LineChart datasets={datasets} labels={labels} title="Test" />
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

const ConnectedComponent = Relay.createContainer(EcoCounterContent, {
  initialVariables: {
    channel1Id: null,
    channel2Id: null,
    domain: null,
    step: null,
    begin: null,
    end: null,
  },
  fragments: {
    channel1: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel1Id, 
          domain: $domain, 
          step: $step, 
          begin: $begin, 
          end: $end
        ) {        
          date
          counts
          status
        }
      }
    `,
    channel2: () => Relay.QL`
      fragment on Query {
        siteData: ecoCounterSiteData(
          id: $channel2Id, 
          domain: $domain, 
          step: $step, 
          begin: $begin, 
          end: $end
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
  EcoCounterContent as Component,
  EcoCounterButton,
};
