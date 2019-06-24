import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';

function ExternalModesContent(
  { currentLanguage, root: { transportMenu } },
  { config: { defaultLanguage } },
) {
  const openLink = evt => {
    const win = window.open(evt.target.href, evt.target.target);
    win.focus();
  };

  return (
    <ul className="external-modes-list">
      {transportMenu.items.map(item => (
        <li key={item.menuItemId}>
          <a
            href={item.url[currentLanguage] || item.url[defaultLanguage] || ''}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openLink}
          >
            {item.icon && (
              <img
                className="item-icon"
                src={item.icon}
                alt={
                  item.title[currentLanguage] ||
                  item.title[defaultLanguage] ||
                  ''
                }
              />
            )}
            {item.title[currentLanguage] || item.title[defaultLanguage] || ''}
          </a>
        </li>
      ))}
    </ul>
  );
}

ExternalModesContent.propTypes = {
  currentLanguage: PropTypes.string,
  root: PropTypes.shape({
    transportMenu: PropTypes.object,
  }),
};

ExternalModesContent.defaultProps = {
  currentLanguage: '',
  root: {
    transportMenu: {},
  },
};

ExternalModesContent.contextTypes = {
  config: PropTypes.shape({
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default Relay.createContainer(
  connectToStores(ExternalModesContent, ['PreferencesStore'], context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      root: () => Relay.QL`
        fragment on Query {
          transportMenu {
            menuId
            title {
              fi
              sv
              en
            }
            items {
              menuItemId
              title {
                fi
                sv
                en
              }
              url {
                fi
                sv
                en
              }
              icon
            }
          }
        }
      `,
    },
  },
);
