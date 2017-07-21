import React from 'react';
import { QueryRenderer, graphql } from 'react-relay/compat';
import connectToStores from 'fluxible-addons-react/connectToStores';
import withState from 'recompose/withState';
import moment from 'moment';
import StopPageContentContainer from './StopPageContentContainer';
import getEnvironment from '../relayEnvironment';

const StopPageRootContainer = routeProps =>
  <QueryRenderer
    query={graphql.experimental`
      query StopPageQuery(
        $stopId: String!
        $startTime: Long!
        $timeRange: Int
        $numberOfDepartures: Int
        $date: String
      ) {
        stop(id: $stopId) {
          ...StopPageContentContainer_stop
            @arguments(
              #startTime: $startTime
              timeRange: $timeRange
              numberOfDepartures: $numberOfDepartures
              date: $date
            )
        }
      }
    `}
    variables={{
      stopId: routeProps.params.stopId,
      startTime: routeProps.startTime,
      date: routeProps.date,
      timeRange: 12 * 60 * 60,
      numberOfDepartures: 100,
    }}
    environment={getEnvironment()}
    render={({ props }) =>
      props &&
      <StopPageContentContainer
        {...props}
        {...routeProps}
        initialDate={moment().format('YYYYMMDD')}
        setDate={routeProps.setDate}
      />}
  />;

const StopPageContainerWithState = withState(
  'date',
  'setDate',
  moment().format('YYYYMMDD'),
)(StopPageRootContainer);

export default connectToStores(
  StopPageContainerWithState,
  ['TimeStore', 'FavouriteStopsStore'],
  ({ getStore }) => ({
    startTime: getStore('TimeStore').getCurrentTime().unix(),
  }),
);
