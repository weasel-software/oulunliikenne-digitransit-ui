import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import NewsFeed, { NewsFeedItem } from 'hsl-shared-components/lib/NewsFeed';

const StyledNewsFeed = styled(NewsFeed)`
  width: 100%;
  max-width: 800px;
  background: white;
  align-self: center;
`;

const NUMBER_OF_ENTRIES = 3;

export default class NewsFeedContainer extends React.Component {
  state = {
    entities: [],
    offset: 0,
  };

  componentWillMount() {
    this.fetchMore();
  }

  fetchMore = () => {
    const offset = this.state.offset;

    this.setState(
      {
        offset: offset + NUMBER_OF_ENTRIES,
      },
      () =>
        fetch('https://hsl-d8.prod.wunder.io/fi/graphql', {
          method: 'POST',
          body: JSON.stringify({
            query: `
              query NewsQuery {
                nodeQuery(
                  filter: { langcode: "fi"},
                  offset: ${offset},
                  limit: ${NUMBER_OF_ENTRIES}
                ) {
                  entities {
                    entityId
                    __typename
                    ... on NodeNews {
                      title
                      created
                      fieldImages {
                        url
                      }
                    }
                    ... on NodeTrafficBulletin {
                      title
                      created
                    }
                    ... on NodeAnnualReport {
                      title
                      created
                    }
                    ... on NodeHslCustomerBenefits {
                      title
                      created
                      # fieldHslCampaignImage { url }
                    }
                    ... on NodeMarketingContent {
                      title
                      created
                    }
                    ... on NodeBlogPost {
                      title
                      created
                    }
                    entityUrl {
                      path
                    }
                  }
                }
              }
            `,
          }),
        })
          .then(res => res.json())
          .then(({ data }) =>
            this.setState({
              entities: [...this.state.entities, ...data.nodeQuery.entities],
            }),
          ),
    );
  };

  render() {
    return (
      <StyledNewsFeed
        header="Header"
        more={{ text: 'Näytä lisää', action: this.fetchMore }}
      >
        {this.state.entities.map(entity =>
          <a
            href={`https://hsl-d8.prod.wunder.io/${entity.entityUrl.path}`}
            key={entity.entityId}
            style={{ textDecoration: 'none' }}
          >
            <NewsFeedItem
              category={entity.__typename.replace('Node', '')} // eslint-disable-line no-underscore-dangle
              title={entity.title}
              image={
                // eslint-disable-next-line no-underscore-dangle
                entity.__typename === 'NodeNews' &&
                entity.fieldImages.length > 0 &&
                entity.fieldImages[0].url
              }
              timestamp={moment(entity.created, 'MM/DD/YYYY - HH:mm')}
            />
          </a>,
        )}
      </StyledNewsFeed>
    );
  }
}
