import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import ComponentUsageExample from './ComponentUsageExample';
import FooterItem from './FooterItem';

const getFooterItem = (link, currentLanguage, i) => {
  if (
    link.languages &&
    link.languages.length &&
    !link.languages.includes(currentLanguage)
  ) {
    return null;
  }
  return Object.keys(link).length === 0 ? (
    <span className="footer-separator" key={i} />
  ) : (
    <FooterItem key={link.label || link.name} {...link} />
  );
};

const PageFooter = ({ content, currentLanguage, ariaLabel }) => (
  <nav id="page-footer" aria-label={ariaLabel}>
    {content.map((link, i) => getFooterItem(link, currentLanguage, i))}
  </nav>
);

PageFooter.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape(FooterItem.propTypes)),
  ariaLabel: PropTypes.string,
};

PageFooter.defaultProps = {
  content: [],
  ariaLabel: '',
};

PageFooter.displayName = 'PageFooter';

PageFooter.description = () => (
  <div>
    <p>Front page footer for large display</p>
    <ComponentUsageExample description="">
      <PageFooter
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

export default connectToStores(PageFooter, ['PreferencesStore'], context => ({
  currentLanguage: context.getStore('PreferencesStore').getLanguage(),
}));
