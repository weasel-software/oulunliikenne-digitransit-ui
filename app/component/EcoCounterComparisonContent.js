import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import moment from 'moment';
import get from 'lodash/get';

import LineChart from './LineChart';
import Icon from './Icon';
import EcoCounterComparisonDatesSelector from './EcoCounterComparisonDatesSelector';
import { combineEcoCounterCounts, csvExport } from '../util/ecoCounterUtils';

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
    allowedSteps: PropTypes.arrayOf(PropTypes.string),
    renderMonthElement: PropTypes.func,
  };

  static defaultProps = {
    range1channel2: null,
    range2channel2: null,
    channel2Id: null,
    renderMonthElement: null,
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

  getExportLabels = channel =>
    get(channel, 'siteData', []).map(data =>
      this.formatExportDateByStep(data.date),
    );

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

  formatExportDateByStep = date => {
    const { step } = this.props;
    const m = moment(date);
    if (step === STEPS.HOUR) {
      return m.format('DD.MM.YYYY HH:mm');
    } else if (step === STEPS.DAY) {
      return m.format('DD.MM.YYYY');
    } else if (step === STEPS.WEEK) {
      return m.format('DD.MM.YYYY');
    }
    return m.format('MMM YYYY');
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
      allowedSteps,
      renderMonthElement,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
      });
      range2datasets.push({
        label: formatMessage({
          id: `eco-counter-direction-${this.getChannelDirection(channel2Id)}`,
        }),
        data: range2channel2Counts,
        borderColor: '#00AFFF',
        backgroundColor: 'rgba(0,0,0,0)',
        hidden: true,
      });

      const range1ChannelTotals = combineEcoCounterCounts([
        range1channel1Counts,
        range1channel2Counts,
      ]);

      const range2ChannelTotals = combineEcoCounterCounts([
        range2channel1Counts,
        range2channel2Counts,
      ]);

      if (range1ChannelTotals && range1ChannelTotals.length > 0) {
        range1datasets.push({
          label: formatMessage({
            id: 'eco-counter-total',
          }),
          data: range1ChannelTotals,
          borderColor: '#FFC107',
          backgroundColor: 'rgba(0,0,0,0)',
          hidden: false,
        });
      }

      if (range2ChannelTotals && range2ChannelTotals.length > 0) {
        range2datasets.push({
          label: formatMessage({
            id: 'eco-counter-total',
          }),
          data: range2ChannelTotals,
          borderColor: '#FFC107',
          backgroundColor: 'rgba(0,0,0,0)',
          hidden: false,
        });
      }
    }

    return (
      <div className="eco-counter-content">
        <EcoCounterComparisonDatesSelector
          range1={range1}
          range2={range2}
          onRange1Change={newRange => {
            changeRange1(newRange);
          }}
          onRange2Change={newRange => {
            changeRange2(newRange);
          }}
          onComparisonToggleClick={() => {
            console.log('comparison toggle clicked');
          }}
          formatMessage={formatMessage}
          toggleView={this.props.toggleView}
          renderMonthElement={renderMonthElement}
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
        <div className="ecocounter-bottom">
          <div className="button-rows">
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
                disabled={!allowedSteps.includes(STEPS.HOUR)}
                isSmall
              >
                {formatMessage({ id: 'hourly' })}
              </EcoCounterButton>
              <EcoCounterButton
                condition={step === STEPS.DAY}
                onClick={() => changeStep(STEPS.DAY)}
                disabled={!allowedSteps.includes(STEPS.DAY)}
                isSmall
              >
                {formatMessage({ id: 'daily' })}
              </EcoCounterButton>
              <EcoCounterButton
                condition={step === STEPS.WEEK}
                onClick={() => changeStep(STEPS.WEEK)}
                disabled={!allowedSteps.includes(STEPS.WEEK)}
                isSmall
              >
                {formatMessage({ id: 'weekly' })}
              </EcoCounterButton>
              <EcoCounterButton
                condition={step === STEPS.MONTH}
                onClick={() => changeStep(STEPS.MONTH)}
                disabled={!allowedSteps.includes(STEPS.MONTH)}
                isSmall
              >
                {formatMessage({ id: 'monthly' })}
              </EcoCounterButton>
            </div>
            <div className="button-row">
              <button
                onClick={() =>
                  csvExport(
                    range1datasets,
                    this.getExportLabels(range1channel1),
                  )
                }
                className="eco-counter-button eco-counter-button--small export-button"
              >
                <Icon img="icon-icon_export" viewBox="0 0 384 512" />
                {formatMessage({ id: 'export-time-range-1' })}
              </button>
              <button
                onClick={() =>
                  csvExport(
                    range2datasets,
                    this.getExportLabels(range2channel1),
                  )
                }
                className="eco-counter-button eco-counter-button--small export-button"
              >
                <Icon img="icon-icon_export" viewBox="0 0 384 512" />
                {formatMessage({ id: 'export-time-range-2' })}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const EcoCounterButton = ({
  condition,
  isSmall,
  children,
  onClick,
  disabled,
}) => (
  <button
    className={cx('eco-counter-button', {
      'eco-counter-button--small': isSmall,
      'eco-counter-button--active': condition,
      'eco-counter-button--disabled': disabled,
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
  disabled: PropTypes.bool,
};

EcoCounterButton.defaultProps = {
  isSmall: false,
  disabled: false,
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
