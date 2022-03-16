import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import ComponentUsageExample from './ComponentUsageExample';
import FooterItem from './FooterItem';

const getFooterItem = (link, currentLanguage) => {
  if (
    link.languages &&
    link.languages.length &&
    !link.languages.includes(currentLanguage)
  ) {
    return null;
  }
  return Object.keys(link).length === 0 ? (
    <span key="separator" />
  ) : (
    <div key={link.label || link.name} className="offcanvas-section">
      <FooterItem {...link} />
    </div>
  );
};

const MainMenuLinks = ({ content, currentLanguage }) => (
  <div id="page-m-footer">
    {content.map(link => getFooterItem(link, currentLanguage))}
  </div>
);

MainMenuLinks.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape(FooterItem.propTypes)),
};

MainMenuLinks.defaultProps = {
  content: [],
};

MainMenuLinks.description = () => (
  <div>
    <p>Main menu links for mobile display</p>
    <ComponentUsageExample description="">
      <MainMenuLinks
        currentLanguage="en"
        content={[
          { name: 'Feedback', icon: 'icon-icon_speech-bubble', route: '/' },
          {},
          { name: 'Print', icon: 'icon-icon_print', route: '/' },
          {},
          { name: 'Home', icon: 'icon-icon_place', route: '/' },
        ]}
      />
    </ComponentUsageExample>
  </div>
);

export default connectToStores(
  MainMenuLinks,
  ['PreferencesStore'],
  context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  }),
);
