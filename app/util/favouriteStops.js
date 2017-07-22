import { graphql } from 'relay-runtime';

export default graphql`
  query favouriteStopsQuery($ids: [String!]!) {
    stops(ids: $ids) {
      gtfsId
      lat
      lon
      name
      desc
      code
      routes {
        mode
      }
    }
  }
`;
