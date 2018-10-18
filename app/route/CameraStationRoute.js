/* eslint-disable */

import Relay from 'react-relay/classic';

export default class CameraStationRoute extends Relay.Route {
  static queries = {
    weatherCamera: () => Relay.QL`
      query ($id: String!) {
        weatherCamera (id: $id)
      }
    `,
    trafficCamera: () => Relay.QL`
      query ($id: String!) {
        trafficCamera (id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'CameraStationRoute';
}
