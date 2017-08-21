import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import connectToStores from 'fluxible-addons-react/connectToStores';
import NewsFeed, { NewsFeedItem } from 'hsl-shared-components/lib/NewsFeed';

const StyledNewsFeed = styled(NewsFeed)`
  align-self: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 3em;
`;

const StyledNewsItem = styled(NewsFeedItem)`
  background: white;
`;

const NUMBER_OF_ENTRIES = 3;

const initialState = {
  entities: [],
  offset: 0,
  count: 0,
};

class NewsFeedContainer extends React.Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  state = initialState;

  componentWillMount() {
    this.fetchMore();
  }

  componentWillReceiveProps({ locale }) {
    if (locale !== this.props.locale) {
      this.setState(initialState, this.fetchMore);
    }
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
                  filter: { langcode: "${this.props.locale}"},
                  offset: ${offset},
                  limit: ${NUMBER_OF_ENTRIES}
                ) {
                  count
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
              count: data.count,
            }),
          ),
    );
  };

  render() {
    return (
      <StyledNewsFeed
        header="Header"
        more={{
          text:
            this.state.offset >= this.state.count
              ? 'Ei vanhempia uutisia'
              : 'Näytä lisää',
          action: this.fetchMore,
        }}
      >
        {this.state.entities.map(entity =>
          <a
            href={`https://hsl-d8.prod.wunder.io/${entity.entityUrl.path}`}
            key={entity.entityId}
            style={{ textDecoration: 'none' }}
          >
            <StyledNewsItem
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

export default connectToStores(
  NewsFeedContainer,
  ['PreferencesStore'],
  context => {
    const language = context.getStore('PreferencesStore').getLanguage();
    return { locale: language };
  },
);
