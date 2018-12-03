import Relay from 'react-relay/classic';

export default class DisordersRoute extends Relay.Route {
  static queries = {
    trafficDisorder: () => Relay.QL`
      query ($id: String!) {
        trafficDisorder(id: $id)
      }
    `,
    /* trafficAnnouncement: () => Relay.QL`
      query ($id: String!) {
        trafficAnnouncement(id: $id)
      }
    `, */
  };
  static paramDefinitions = {
    id: { required: true },
  };
  static routeName = 'DisordersRoute';
}
