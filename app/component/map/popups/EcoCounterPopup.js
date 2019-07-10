import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import connectToStores from 'fluxible-addons-react/connectToStores';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import ComponentUsageExample from '../../ComponentUsageExample';
import EcoCounterContent from '../../EcoCounterContent';
import EcoCounterDataRoute from '../../../route/EcoCounterDataRoute';

const TO_CENTRE = 'to-centre';
const FROM_CENTRE = 'from-centre';
const WALKING = 1;
const CYCLING = 2;
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
    site: PropTypes.object.isRequired,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  static description = (
    <div>
      <p>Renders an eco counter popup.</p>
      <ComponentUsageExample description="">
        <EcoCounterPopup context="context object here" />
      </ComponentUsageExample>
    </div>
  );

  state = {
    userType: WALKING,
    direction: TO_CENTRE,
    step: STEPS.HOUR,
  };

  getBeginTime = () => {
    const { step } = this.state;
    const endMoment = moment();
    if (step === STEPS.DAY) {
      endMoment.subtract(1, 'w');
    } else if (step === STEPS.WEEK) {
      endMoment.subtract(1, 'M');
    } else if (step === STEPS.MONTH) {
      endMoment.subtract(1, 'Y');
    } else {
      endMoment.subtract(1, 'd');
    }
    return endMoment.utc().format('YYYY-MM-DDTHH:mm:ss');
  };

  getChannelByUserTypeAndDirection = () => {
    const channels = this.props.site.ecoCounterSite.channels || [];
    const filtered = channels.filter(
      channel => channel.userType === this.state.userType,
    );
    return this.state.direction === FROM_CENTRE ? filtered[0] : filtered[1];
  };

  changeDirection = () => {
    const direction =
      this.state.direction === TO_CENTRE ? FROM_CENTRE : TO_CENTRE;
    this.setState({ direction });
  };

  changeUserType = () => {
    const userType = this.state.userType === WALKING ? CYCLING : WALKING;
    this.setState({ userType });
  };

  render() {
    const {
      site: { ecoCounterSite },
    } = this.props;
    return (
      <div className="card">
        <Card className="padding-small">
          <CardHeader
            name={this.context.intl.formatMessage({
              id: 'eco-counter',
              defaultMessage: 'Eco counter',
            })}
            description={ecoCounterSite.name}
            icon="icon-icon_eco-counter"
            unlinked
          />
          <Relay.Renderer
            Container={EcoCounterContent}
            queryConfig={
              new EcoCounterDataRoute({
                id: ecoCounterSite.channels[0].siteId,
                domain: ecoCounterSite.domain,
                begin: this.getBeginTime(),
                step: this.state.step,
                end: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
              })
            }
            environment={Relay.Store}
          />
        </Card>
      </div>
    );
  }
}

export default Relay.createContainer(
  connectToStores(EcoCounterPopup, ['PreferencesStore'], context => ({
    lang: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    initialVariables: {
      domain: null,
      id: null,
      end: null,
      begin: null,
      step: null,
    },
    fragments: {
      site: () => Relay.QL`
        fragment on Query {
          ecoCounterSite(domain: $domain, id: $id) {
            id
            siteId
            name
            domain
            lat
            lon
            channels {
              id
              siteId
              name
              userType
            }
          }
        }
      `,
    },
  },
);
