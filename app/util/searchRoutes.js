import { graphql } from 'relay-runtime';

export default graphql`
  query searchRoutesQuery($name: String) {
    viewer {
      routes(name: $name) {
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
  }
`;
