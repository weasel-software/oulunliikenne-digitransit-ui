import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Relay from 'react-relay/classic';
import cx from 'classnames';
import sortBy from 'lodash/sortBy';
import { routerShape } from 'react-router';
import connectToStores from 'fluxible-addons-react/connectToStores';
import Icon from './Icon';
import ComponentUsageExample from './ComponentUsageExample';
import { routePatterns as exampleRoutePatterns } from './ExampleData';
import { PREFIX_ROUTES } from '../util/path';

const DATE_FORMAT = 'YYYYMMDD';

class RoutePatternSelect extends Component {
  static propTypes = {
    params: PropTypes.object,
    className: PropTypes.string,
    route: PropTypes.object,
    onSelectChange: PropTypes.func.isRequired,
    serviceDay: PropTypes.string.isRequired,
    activeTab: PropTypes.string.isRequired,
    relay: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    gtfsId: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: routerShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.relay.setVariables({ serviceDay: this.props.serviceDay });
    this.state = {
      loading: false,
    };
  }

  componentWillMount = () => {
    const options = this.getOptions(this.props);
    if (options === null) {
      this.setState({ loading: true });
    }
  };

  shouldComponentUpdate = nextProps => {
    const options = this.getOptions(nextProps);
    if (options !== null) {
      if (this.state.loading === true) {
        this.setState({ loading: false });
      }
      return true;
    }
    return false;
  };

  getOptions = props => {
    const options =
      props.route.patterns.find(
        o => o.tripsForDate && o.tripsForDate.length > 0,
      ) !== undefined ||
      (props.route.patterns.find(
        o => o.tripsForDate && o.tripsForDate.length > 0,
      ) === undefined &&
        props.activeTab === 'aikataulu')
        ? sortBy(props.route.patterns, 'code')
            .filter(
              o =>
                props.activeTab !== 'aikataulu'
                  ? o.tripsForDate && o.tripsForDate.length > 0
                  : o,
            )
            .map(pattern => (
              <option key={pattern.code} value={pattern.code}>
                {pattern.stops[0].name} ➔ {pattern.headsign}
              </option>
            ))
        : null;
    const patternDepartures =
      options && options.filter(o => o.key === props.params.patternId);
    if (patternDepartures && patternDepartures.length === 0) {
      this.context.router.replace(
        `/${PREFIX_ROUTES}/${props.gtfsId}/pysakit/${options[0].key}`,
      );
    }
    return options;
  };

  render() {
    const options = this.getOptions(this.props);
    return this.state.loading === true ? (
      <div className={cx('route-pattern-select', this.props.className)} />
    ) : (
      <div
        className={cx('route-pattern-select', this.props.className, {
          hidden:
            this.props.route.patterns.find(
              o => o.tripsForDate && o.tripsForDate.length > 0,
            ) === undefined && this.props.activeTab !== 'aikataulu',
        })}
      >
        <Icon img="icon-icon_arrow-dropdown" />
        <select
          onChange={this.props.onSelectChange}
          value={this.props.params && this.props.params.patternId}
        >
          {options}
        </select>
      </div>
    );
  }
}

RoutePatternSelect.description = () => (
  <div>
    <p>Display a dropdown to select the pattern for a route</p>
    <ComponentUsageExample>
      <RoutePatternSelect
        pattern={exampleRoutePatterns}
        onSelectChange={() => {}}
      />
    </ComponentUsageExample>
  </div>
);

export default connectToStores(
  Relay.createContainer(RoutePatternSelect, {
    initialVariables: {
      serviceDay: '19700101',
    },
    fragments: {
      route: () => Relay.QL`
      fragment on Route {
        patterns {
          code
          headsign
          stops {
            name
          }
          tripsForDate(serviceDate: $serviceDay) {
            id
            stoptimes: stoptimesForDate(serviceDate: $serviceDay) {
              scheduledArrival
              scheduledDeparture
              serviceDay
              stop {
                id
              }
            }
          }
        }
      }
      `,
    },
  }),
  [],
  context => ({
    serviceDay: context
      .getStore('TimeStore')
      .getCurrentTime()
      .format(DATE_FORMAT),
  }),
);
