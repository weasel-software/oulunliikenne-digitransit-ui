import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import _uniq from 'lodash/uniq';
import moment from 'moment';
import get from 'lodash/get';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import EcoCounterContent, { CYCLING } from '../../EcoCounterContent';
import EcoCounterComparisonContent from '../../EcoCounterComparisonContent';
import EcoCounterDualChannelRoute from '../../../route/EcoCounterDualChannelRoute';
import EcoCounterSingleChannelRoute from '../../../route/EcoCounterSingleChannelRoute';
import EcoCounterComparisonDualChannelRoute from '../../../route/EcoCounterComparisonDualChannelRoute';
import EcoCounterComparisonSingleChannelRoute from '../../../route/EcoCounterComparisonSingleChannelRoute';
import LoadingPage from '../../LoadingPage';
import NetworkError from '../../NetworkError';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

const STEPS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const VIEW = {
  SINGLE: 'single',
  COMPARISON: 'comparison',
};

class EcoCounterPopup extends React.Component {
  static displayName = 'EcoCounterPopup';
  static propTypes = {
    domain: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    isComparison: PropTypes.bool,
    initialBegin: PropTypes.object,
    initialEnd: PropTypes.object,
    initialStep: PropTypes.string,
  };
  static defaultProps = {
    isComparison: false,
    initialBegin: undefined,
    initialEnd: undefined,
    initialStep: undefined,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    router: routerShape.isRequired,
    location: locationShape.isRequired,
    config: PropTypes.object.isRequired,
  };
  static description = (
    <div>
      <p>Renders an eco counter popup.</p>
      <ComponentUsageExample description="">
        <EcoCounterPopup
          domain=""
          name=""
          channels={[]}
          context="context object here"
        />
      </ComponentUsageExample>
    </div>
  );

  // eslint-disable-next-line react/sort-comp
  availableUserTypes = _uniq(this.props.channels.map(c => c.userType));

  constructor(props, context) {
    super(props, context);

    // eslint-disable-next-line no-underscore-dangle
    const hasInitialBegin = props.initialBegin && props.initialBegin._isValid;
    const initialBegin = hasInitialBegin
      ? props.initialBegin
      : moment().subtract(1, 'day');

    // eslint-disable-next-line no-underscore-dangle
    const hasInitialEnd = props.initialEnd && props.initialEnd._isValid;
    const initialEnd = hasInitialEnd ? props.initialEnd : moment();

    const initialStep = props.initialStep || STEPS.HOUR;

    this.state = {
      view: props.isComparison ? VIEW.COMPARISON : VIEW.SINGLE,
      date: initialBegin,
      userType: this.availableUserTypes.includes(CYCLING)
        ? CYCLING
        : this.availableUserTypes[0],
      step: initialStep,
      comparisonRange1: [initialBegin, initialEnd],
      comparisonRange2: [initialBegin, initialEnd],
    };
  }

  getRange1Begin = () => this.state.comparisonRange1[0];
  getRange1End = () => this.state.comparisonRange1[1];
  getRange2Begin = () => this.state.comparisonRange2[0];
  getRange2End = () => this.state.comparisonRange2[1];

  getBegin = () => {
    const { step } = this.state;

    const date = this.state.date.clone();

    switch (step) {
      case STEPS.MONTH:
        return date.startOf('year');
      case STEPS.WEEK:
        return date.startOf('month');
      case STEPS.DAY:
        return date.startOf('week');
      case STEPS.HOUR:
      default:
        return date.startOf('day');
    }
  };

  getEnd = () => {
    const { step } = this.state;

    const date = this.state.date.clone();

    switch (step) {
      case STEPS.MONTH:
        return date.endOf('year');
      case STEPS.WEEK:
        return date.endOf('month');
      case STEPS.DAY:
        return date.endOf('week');
      case STEPS.HOUR:
      default:
        return date.add(1, 'day').startOf('day');
    }
  };

  formatDate = date => date.utc().format(DATE_FORMAT);

  getChannelsByUserType = () => {
    const channels = this.props.channels || [];
    return channels.filter(channel => channel.userType === this.state.userType);
  };

  changeStep = step => {
    this.setState({ step });
  };

  changeUserType = userType => {
    this.setState({ userType });
  };

  changeDate = date => {
    this.setState({ date });
  };

  toggleView = () => {
    const { view } = this.state;
    let { step } = this.state;
    const newView = view === VIEW.SINGLE ? VIEW.COMPARISON : VIEW.SINGLE;

    if (newView === VIEW.COMPARISON) {
      const allowedSteps = this.getAllowedSteps(
        this.state.comparisonRange1,
        this.state.comparisonRange2,
      );
      if (allowedSteps.includes(step) === false) {
        [step] = allowedSteps;
      }
    }

    this.setState({
      step,
      view: newView,
    });
  };

  openComparison = event => {
    event.preventDefault();
    const { router, location } = this.context;
    router.push({
      ...location,
      state: {
        ...location.state,
        ecoCounterComparisonOpen: true,
        ecoCounterProps: {
          channels: this.props.channels,
          domain: this.props.domain,
          name: this.props.name,
          initialBegin: this.getBegin(),
          initialEnd: this.getEnd(),
          initialStep: this.state.step,
        },
      },
    });
  };

  getAllowedSteps = (range1, range2) => {
    const [range1start, range1end] = range1;
    const [range2start, range2end] = range2;

    const rangeLengthInDays = Math.max(
      range1end.diff(range1start, 'days'),
      range2end.diff(range2start, 'days'),
    );

    if (rangeLengthInDays <= 7) {
      return [STEPS.HOUR, STEPS.DAY];
    }
    if (rangeLengthInDays <= 31) {
      return [STEPS.DAY, STEPS.WEEK];
    }
    return [STEPS.WEEK, STEPS.MONTH];
  };

  changeComparisonRange = (range1, range2) => {
    const allowedSteps = this.getAllowedSteps(range1, range2);

    this.setState({
      comparisonRange1: range1,
      comparisonRange2: range2,
      step: allowedSteps.includes(this.state.step)
        ? this.state.step
        : allowedSteps[0],
    });
  };

  getYears = () => {
    const years = [];

    for (let i = moment().year(); i >= 2010; i--) {
      years.push(
        <option key={`_${i}`} value={i}>
          {i}
        </option>,
      );
    }

    return years;
  };

  getMonths = () =>
    moment.months().map((month, i) => (
      <option key={month} value={i}>
        {month}
      </option>
    ));

  renderMonthElement = ({ month, onYearSelect, onMonthSelect }) => (
    <div className="eco-counter-popup-month-element">
      <select
        value={month.month()}
        onChange={e => onMonthSelect(month, parseInt(e.target.value, 10))}
      >
        {this.getMonths()}
      </select>
      <select
        value={month.year()}
        onChange={e => onYearSelect(month, e.target.value)}
      >
        {this.getYears()}
      </select>
    </div>
  );

  render() {
    const selectedChannels = this.getChannelsByUserType();
    const { view, comparisonRange1, comparisonRange2 } = this.state;

    let queryConfig;
    if (view === VIEW.COMPARISON) {
      const [range1begin, range1end] = this.state.comparisonRange1;
      const [range2begin, range2end] = this.state.comparisonRange2;
      queryConfig =
        selectedChannels.length > 1
          ? new EcoCounterComparisonDualChannelRoute({
              channel1Id: get(selectedChannels, '[0].id'),
              channel2Id: get(selectedChannels, '[1].id'),
              domain: this.props.domain,
              range1begin,
              range1end,
              range2begin,
              range2end,
              step: this.state.step,
            })
          : new EcoCounterComparisonSingleChannelRoute({
              channel1Id: get(selectedChannels, '[0].id'),
              domain: this.props.domain,
              range1begin,
              range1end,
              range2begin,
              range2end,
              step: this.state.step,
            });
    } else {
      const begin = this.formatDate(this.getBegin());
      const end = this.formatDate(this.getEnd());
      queryConfig =
        selectedChannels.length > 1
          ? new EcoCounterDualChannelRoute({
              channel1Id: get(selectedChannels, '[0].id'),
              channel2Id: get(selectedChannels, '[1].id'),
              domain: this.props.domain,
              begin,
              step: this.state.step,
              end,
            })
          : new EcoCounterSingleChannelRoute({
              channel1Id: get(selectedChannels, '[0].id'),
              domain: this.props.domain,
              begin,
              step: this.state.step,
              end,
            });
    }

    return (
      <div className={`card ${view}`}>
        <Card className="padding-small">
          <CardHeader
            name={this.context.intl.formatMessage({
              id: 'eco-counter',
              defaultMessage: 'Eco counter',
            })}
            description={this.props.name}
            icon="icon-icon_eco-counter"
            unlinked
          />
          <Relay.Renderer
            Container={
              view === VIEW.SINGLE
                ? EcoCounterContent
                : EcoCounterComparisonContent
            }
            queryConfig={queryConfig}
            environment={Relay.Store}
            render={({ done, error, loading, retry, props }) => {
              if (done) {
                console.log(props);
                return view === VIEW.SINGLE ? (
                  <EcoCounterContent
                    {...props}
                    date={this.state.date}
                    channels={selectedChannels}
                    changeUserType={this.changeUserType}
                    changeStep={this.changeStep}
                    changeDate={this.changeDate}
                    userType={this.state.userType}
                    step={this.state.step}
                    formatMessage={this.context.intl.formatMessage}
                    availableUserTypes={this.availableUserTypes}
                    toggleView={this.toggleView}
                    renderMonthElement={this.renderMonthElement}
                    openComparison={this.openComparison}
                    analyticsUrl={this.context.config.URL.ANALYTICS}
                  />
                ) : (
                  <EcoCounterComparisonContent
                    {...props}
                    channels={selectedChannels}
                    changeUserType={this.changeUserType}
                    changeStep={this.changeStep}
                    userType={this.state.userType}
                    step={this.state.step}
                    formatMessage={this.context.intl.formatMessage}
                    availableUserTypes={this.availableUserTypes}
                    toggleView={this.toggleView}
                    range1={comparisonRange1}
                    range2={comparisonRange2}
                    changeRange1={newRange => {
                      this.changeComparisonRange(newRange, comparisonRange2);
                    }}
                    changeRange2={newRange => {
                      this.changeComparisonRange(comparisonRange1, newRange);
                    }}
                    allowedSteps={this.getAllowedSteps(
                      comparisonRange1,
                      comparisonRange2,
                    )}
                    renderMonthElement={this.renderMonthElement}
                  />
                );
              } else if (loading) {
                return <LoadingPage />;
              } else if (error) {
                return <NetworkError retry={retry} />;
              }
              return undefined;
            }}
          />
        </Card>
      </div>
    );
  }
}

export default EcoCounterPopup;
