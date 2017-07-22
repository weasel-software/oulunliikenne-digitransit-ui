import { graphql } from 'relay-runtime';

export default graphql`
  query favouriteRoutesQuery($ids: [String!]!) {
    routes(ids: $ids) {
      gtfsId
      agency {
        name
      }
      shortName
      mode
      longName
      patterns {
        code
      }
    }
  }
`;
