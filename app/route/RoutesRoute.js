import Relay from 'react-relay/classic';

export default class RoutesRoute extends Relay.Route {
  static queries = {
    routes: (Component, variables) => Relay.QL`
      query ($feeds: [String]){
        routes (feeds:$feeds) {
          ${Component.getFragment('routes', {
            feeds: variables.feeds,
          })}
    }}`,
  };
  static paramDefinitions = {
    feeds: { required: true },
  };
  static routeName = 'RoutesRoute';
}
