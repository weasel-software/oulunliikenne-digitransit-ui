import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import { routerShape, locationShape } from 'react-router';
import connectToStores from 'fluxible-addons-react/connectToStores';

import Modal from './Modal';

function NavbarLinksContent(
  { currentLanguage, root: { linkMenu } },
  { router, location, config: { defaultLanguage } },
) {
  const isOpen = () =>
    location.state ? location.state.navbarLinksOpen : false;
  if (!isOpen()) {
    return null;
  }

  const toggleVisibility = () => {
    if (isOpen()) {
      router.goBack();
    } else {
      router.push({
        ...location,
        state: {
          ...location.state,
          navbarLinksOpen: true,
        },
      });
    }
  };

  const openLink = evt => {
    const win = window.open(evt.target.href, evt.target.target);
    win.focus();
  };

  return (
    <Modal
      open
      title={
        linkMenu.title[currentLanguage] || linkMenu.title[defaultLanguage] || ''
      }
      toggleVisibility={toggleVisibility}
    >
      {linkMenu.body && (
        <p>
          {linkMenu.body[currentLanguage] ||
            linkMenu.body[defaultLanguage] ||
            ''}
        </p>
      )}

      {linkMenu.items && (
        <ul className="navbar-links-list">
          {linkMenu.items.map(item => (
            <li key={item.menuItemId}>
              <a
                href={
                  item.url[currentLanguage] || item.url[defaultLanguage] || ''
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={openLink}
              >
                {item.title[currentLanguage] ||
                  item.title[defaultLanguage] ||
                  ''}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

NavbarLinksContent.propTypes = {
  currentLanguage: PropTypes.string,
  root: PropTypes.shape({
    linkMenu: PropTypes.object,
  }),
};

NavbarLinksContent.defaultProps = {
  currentLanguage: '',
  root: {
    linkMenu: {},
  },
};

NavbarLinksContent.contextTypes = {
  router: routerShape.isRequired, // eslint-disable-line react/no-typos
  location: locationShape.isRequired, // eslint-disable-line react/no-typos
  config: PropTypes.shape({
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default Relay.createContainer(
  connectToStores(NavbarLinksContent, ['PreferencesStore'], context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  })),
  {
    fragments: {
      root: () => Relay.QL`
        fragment on Query {
          linkMenu {
            menuId
            title {
              fi
              sv
              en
            }
            body {
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
            }
          }
        }
      `,
    },
  },
);
