import Relay from 'react-relay/classic';

export default class TrafficAnnouncementRoute extends Relay.Route {
  static queries = {
    trafficAnnouncement: () => Relay.QL`
      query ($id: String!) {
        trafficAnnouncement(id: $id)
      }
    `,
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'TrafficAnnouncementRoute';
}
