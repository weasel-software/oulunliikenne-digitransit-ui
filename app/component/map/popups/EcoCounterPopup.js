import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import _uniq from 'lodash/uniq';
import moment from 'moment';
import get from 'lodash/get';
import { intlShape } from 'react-intl';

import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import EcoCounterContent, { CYCLING } from '../../EcoCounterContent';
import EcoCounterDualChannelRoute from '../../../route/EcoCounterDualChannelRoute';
import EcoCounterSingleChannelRoute from '../../../route/EcoCounterSingleChannelRoute';
import LoadingPage from '../../LoadingPage';
import NetworkError from '../../NetworkError';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const STEPS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

class EcoCounterPopup extends React.Component {
  static displayName = 'EcoCounterPopup';
  static propTypes = {
    domain: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
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

  state = {
    date: moment().subtract(1, 'day'),
    userType: this.availableUserTypes.includes(CYCLING)
      ? CYCLING
      : this.availableUserTypes[0],
    step: STEPS.HOUR,
  };

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

  formatDate = date => {
    const { step } = this.state;

    if (step === STEPS.HOUR) {
      return date.utc().format(DATE_FORMAT);
    }

    return date.format(DATE_FORMAT);
  };

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

  render() {
    const selectedChannels = this.getChannelsByUserType();
    const begin = this.formatDate(this.getBegin());
    const end = this.formatDate(this.getEnd());

    return (
      <div className="card">
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
            Container={EcoCounterContent}
            queryConfig={
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
                  })
            }
            environment={Relay.Store}
            render={({ done, error, loading, retry, props }) => {
              if (done) {
                return (
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
