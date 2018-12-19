/* eslint-disable */

import Relay from 'react-relay/classic';

export default class CameraStationRoute extends Relay.Route {
  static queries = {
    camera: () => Relay.QL`
      query ($id: String!) {
        camera (id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'CameraStationRoute';
}
