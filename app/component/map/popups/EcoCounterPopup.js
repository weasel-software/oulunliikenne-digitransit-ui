import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import _uniq from 'lodash/uniq';
import moment from 'moment';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import EcoCounterContent from '../../EcoCounterContent';
import EcoCounterDataRoute from '../../../route/EcoCounterDataRoute';
import LoadingPage from '../../LoadingPage';
import NetworkError from '../../NetworkError';

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
    channels: PropTypes.array.isRequired,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static description = (
    <div>
      <p>Renders an eco counter popup.</p>
      <ComponentUsageExample description="">
        <EcoCounterPopup channels={[]} context="context object here" />
      </ComponentUsageExample>
    </div>
  );

  // eslint-disable-next-line react/sort-comp
  availableUserTypes = _uniq(this.props.channels.map(c => c.userType));

  state = {
    userType: this.availableUserTypes[0],
    step: STEPS.HOUR,
  };

  // TODO: Use current time and and date, once the api returns counts for current date.
  getEndMoment = () =>
    moment()
      .subtract(1, 'd')
      .hours(23)
      .minutes(59)
      .seconds(59);

  getEndTimestamp = () =>
    this.getEndMoment()
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss');

  getBeginTimestamp = () => {
    const { step } = this.state;
    const endMoment = this.getEndMoment();
    if (step === STEPS.DAY) {
      endMoment.subtract(1, 'w');
    } else if (step === STEPS.WEEK) {
      endMoment.subtract(1, 'M');
    } else if (step === STEPS.MONTH) {
      endMoment.subtract(1, 'Y');
    } else {
      endMoment
        .hours(0)
        .minutes(0)
        .seconds(0);
    }
    return endMoment.utc().format('YYYY-MM-DDTHH:mm:ss');
  };

  getChannelsByUserType = () => {
    const channels = this.props.channels || [];
    const filtered = channels.filter(
      channel => channel.userType === this.state.userType,
    );
    return filtered;
  };

  changeStep = step => {
    this.setState({ step });
  };

  changeUserType = userType => {
    this.setState({ userType });
  };

  render() {
    const selectedChannels = this.getChannelsByUserType();
    const inChannel = selectedChannels.find(c => c.direction === 1);
    const outChannel = selectedChannels.find(c => c.direction === 2);
    let inId = inChannel ? inChannel.id : null;
    let outId = outChannel ? outChannel.id : null;
    let directionAvailable = true;
    if (!inId && !outId && selectedChannels.length > 0) {
      inId = selectedChannels[0].id || null;
      outId = selectedChannels[1].id || null;
      directionAvailable = false;
    }
    return (
      <div className="card">
        <Card className="padding-small">
          <CardHeader
            name={this.context.intl.formatMessage({
              id: 'eco-counter',
              defaultMessage: 'Eco counter',
            })}
            description={this.props.channels[0].name}
            icon="icon-icon_eco-counter"
            unlinked
          />
          <Relay.Renderer
            Container={EcoCounterContent}
            queryConfig={
              new EcoCounterDataRoute({
                outId,
                inId,
                domain: this.props.channels[0].domain,
                begin: this.getBeginTimestamp(),
                step: this.state.step,
                end: this.getEndTimestamp(),
              })
            }
            environment={Relay.Store}
            render={({ done, error, loading, retry, props }) => {
              if (done) {
                return (
                  <EcoCounterContent
                    {...props}
                    changeUserType={this.changeUserType}
                    changeStep={this.changeStep}
                    userType={this.state.userType}
                    step={this.state.step}
                    formatMessage={this.context.intl.formatMessage}
                    availableUserTypes={this.availableUserTypes}
                    directionAvailable={directionAvailable}
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
