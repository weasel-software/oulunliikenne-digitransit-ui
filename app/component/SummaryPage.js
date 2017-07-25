import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { graphql } from 'relay-runtime';
import { createContainer as createFragmentContainer } from 'react-relay/lib/ReactRelayFragmentContainer';

import isMatch from 'lodash/isMatch';
import keys from 'lodash/keys';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';
import some from 'lodash/some';
import polyline from 'polyline-encoded';
import { FormattedMessage } from 'react-intl';

import DesktopView from '../component/DesktopView';
import MobileView from '../component/MobileView';
import Map from '../component/map/Map';
import ItineraryTab from './ItineraryTab';

import SummaryPlanContainer from './SummaryPlanContainer';
import SummaryNavigation from './SummaryNavigation';
import ItineraryLine from '../component/map/ItineraryLine';
import LocationMarker from '../component/map/LocationMarker';
import MobileItineraryWrapper from './MobileItineraryWrapper';
import { otpToLocation } from '../util/otpStrings';
import Loading from './Loading';

function getActiveIndex(state) {
  return (state && state.summaryPageSelected) || 0;
}

class SummaryPage extends React.Component {
  static contextTypes = {
    breakpoint: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    config: PropTypes.object,
  };

  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object,
      query: PropTypes.shape({
        intermediatePlaces: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
          PropTypes.string.isRequired,
        ]),
      }).isRequired,
    }).isRequired,
    params: PropTypes.shape({
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      hash: PropTypes.string,
    }).isRequired,
    plan: PropTypes.shape({
      itineraries: PropTypes.array,
    }).isRequired,
    content: PropTypes.node,
    map: PropTypes.shape({
      type: PropTypes.func.isRequired,
    }),
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        fullscreenMap: PropTypes.bool,
      }).isRequired,
    ).isRequired,
  };

  static hcParameters = {
    walkReluctance: 2,
    walkBoardCost: 600,
    minTransferTime: 180,
    walkSpeed: 1.2,
    wheelchair: false,
  };

  state = { center: null };

  componentWillMount = () =>
    this.initCustomizableParameters(this.context.config);

  componentWillReceiveProps(newProps, newContext) {
    if (newContext.breakpoint === 'large' && this.state.center) {
      this.setState({ center: null });
    }
  }

  initCustomizableParameters = config => {
    this.customizableParameters = {
      ...SummaryPage.hcParameters,
      modes: Object.keys(config.transportModes)
        .filter(mode => config.transportModes[mode].defaultValue === true)
        .map(mode => config.modeToOTP[mode])
        .concat(
          Object.keys(config.streetModes)
            .filter(mode => config.streetModes[mode].defaultValue === true)
            .map(mode => config.modeToOTP[mode]),
        )
        .sort()
        .join(','),
      maxWalkDistance: config.maxWalkDistance,
      preferred: { agencies: config.preferredAgency || '' },
    };
  };

  updateCenter = (lat, lon) => {
    this.setState({ center: { lat, lon } });
  };

  hasDefaultPreferences = () => {
    const a = pick(this.customizableParameters, keys(this.props));
    const b = pick(this.props, keys(this.customizableParameters));
    return isMatch(a, b);
  };
  renderMap() {
    const { plan, location: { state, query } } = this.props;
    const activeIndex = getActiveIndex(state);
    const itineraries = (plan && plan.itineraries) || [];

    const leafletObjs = sortBy(
      itineraries.map((itinerary, i) =>
        <ItineraryLine
          key={i}
          hash={i}
          legs={itinerary.legs}
          passive={i !== activeIndex}
        />,
      ),
      // Make sure active line isn't rendered over
      i => i.props.passive === false,
    );

    const from = otpToLocation(this.props.params.from);
    const to = otpToLocation(this.props.params.to);

    if (from.lat && from.lon) {
      leafletObjs.push(
        <LocationMarker key="fromMarker" position={from} className="from" />,
      );
    }

    if (to.lat && to.lon) {
      leafletObjs.push(
        <LocationMarker key="toMarker" position={to} className="to" />,
      );
    }

    if (query && query.intermediatePlaces) {
      if (Array.isArray(query.intermediatePlaces)) {
        query.intermediatePlaces.map(otpToLocation).forEach((location, i) => {
          leafletObjs.push(
            <LocationMarker
              key={`via_${i}`}
              position={location}
              className="via"
              noText
            />,
          );
        });
      } else {
        leafletObjs.push(
          <LocationMarker
            key={'via'}
            position={otpToLocation(query.intermediatePlaces)}
            className="via"
            noText
          />,
        );
      }
    }

    // Decode all legs of all itineraries into latlong arrays,
    // and concatenate into one big latlong array
    const bounds = [].concat(
      [[from.lat, from.lon], [to.lat, to.lon]],
      ...itineraries.map(itinerary =>
        [].concat(
          ...itinerary.legs.map(leg => polyline.decode(leg.legGeometry.points)),
        ),
      ),
    );

    return (
      <Map
        className="summary-map"
        leafletObjs={leafletObjs}
        fitBounds
        bounds={bounds}
        showScaleBar
      />
    );
  }

  render() {
    const { breakpoint } = this.context;
    // Call props.map directly in order to render to same map instance
    const map = this.props.map
      ? this.props.map.type(
          {
            itinerary:
              this.props.plan.itineraries &&
              this.props.plan.itineraries[this.props.params.hash],
            center: this.state.center,
            from: otpToLocation(this.props.params.from),
            to: otpToLocation(this.props.params.to),
            ...this.props,
          },
          this.context,
        )
      : this.renderMap();

    let earliestStartTime;
    let latestArrivalTime;

    if (this.props.plan && this.props.plan.itineraries) {
      earliestStartTime = Math.min(
        ...this.props.plan.itineraries.map(i => i.startTime),
      );
      latestArrivalTime = Math.max(
        ...this.props.plan.itineraries.map(i => i.endTime),
      );
    }

    const hasDefaultPreferences = this.hasDefaultPreferences();

    let intermediatePlaces = [];
    const query = this.props.location.query;

    if (query && query.intermediatePlaces) {
      if (Array.isArray(query.intermediatePlaces)) {
        intermediatePlaces = query.intermediatePlaces.map(otpToLocation);
      } else {
        intermediatePlaces = [otpToLocation(query.intermediatePlaces)];
      }
    }

    if (breakpoint === 'large') {
      let content;

      if (this.props.plan) {
        content = (
          <SummaryPlanContainer
            plan={this.props.plan}
            itineraries={this.props.plan.itineraries}
            params={this.props.params}
            // error={error}
            intermediatePlaces={intermediatePlaces}
          >
            {this.props.content &&
              React.cloneElement(this.props.content, {
                itinerary: this.props.plan.itineraries[this.props.params.hash],
                focus: this.updateCenter,
                plan: this.props.plan,
              })}
          </SummaryPlanContainer>
        );
      } else {
        content = (
          <div style={{ position: 'relative', height: 200 }}>
            <Loading />
          </div>
        );
      }

      return (
        <DesktopView
          title={
            <FormattedMessage
              id="summary-page.title"
              defaultMessage="Itinerary suggestions"
            />
          }
          header={
            <SummaryNavigation
              params={this.props.params}
              hasDefaultPreferences={hasDefaultPreferences}
              startTime={earliestStartTime}
              endTime={latestArrivalTime}
            />
          }
          // TODO: Chceck preferences
          content={content}
          map={map}
        />
      );
    }

    let content;

    if (!this.props.plan) {
      content = (
        <div style={{ position: 'relative', height: 200 }}>
          <Loading />
        </div>
      );
    } else if (this.props.params.hash) {
      content = (
        <MobileItineraryWrapper
          itineraries={this.props.plan.itineraries}
          params={this.props.params}
          fullscreenMap={some(
            this.props.routes.map(route => route.fullscreenMap),
          )}
          focus={this.updateCenter}
        >
          {this.props.content &&
            this.props.plan.itineraries.map((itinerary, i) =>
              React.cloneElement(this.props.content, {
                key: i,
                itinerary,
                plan: this.props.plan,
              }),
            )}
        </MobileItineraryWrapper>
      );
    } else {
      content = (
        <SummaryPlanContainer
          plan={this.props.plan}
          itineraries={this.props.plan.itineraries}
          params={this.props.params}
          from={this.props.params.from}
          to={this.props.params.to}
          intermediatePlaces={intermediatePlaces}
        />
      );
    }

    return (
      <MobileView
        header={
          !this.props.params.hash
            ? <SummaryNavigation
                hasDefaultPreferences={hasDefaultPreferences}
                params={this.props.params}
                startTime={earliestStartTime}
                endTime={latestArrivalTime}
              />
            : false
        }
        content={content}
        map={map}
      />
    );
  }
}

export default createFragmentContainer(SummaryPage, {
  plan: graphql`
    fragment SummaryPage_plan on Plan {
      ...SummaryPlanContainer_plan
      ...ItineraryTab_plan
      itineraries {
        startTime
        endTime
        ...ItineraryTab_itinerary
        ...SummaryPlanContainer_itineraries
        legs {
          ...ItineraryLine_legs
          transitLeg
          legGeometry {
            points
          }
        }
      }
    }
  `,
});
