import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import {
  getShowIntroPopup,
  setShowIntroPopup,
  // removeShowIntroPopup,
} from '../store/localStorage';

import Modal from './Modal';

class IntroPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: getShowIntroPopup(),
    };
  }

  toggleVisibility = () => {
    setShowIntroPopup();
    this.setState({ showPopup: false });
  };

  render() {
    const { currentLanguage } = this.props;
    const {
      config: { introPopup, defaultLanguage },
    } = this.context;

    // removeShowIntroPopup();

    if (!this.state.showPopup || !introPopup) {
      return null;
    }

    const data = introPopup[currentLanguage] || introPopup[defaultLanguage];

    return (
      <Modal
        open
        title={data.header || ''}
        toggleVisibility={this.toggleVisibility}
      >
        {(data.paragraphs || []).map((paragraph, key) => (
          <p key={key}>{paragraph}</p>
        ))}
      </Modal>
    );
  }
}

IntroPopup.propTypes = {
  currentLanguage: PropTypes.string,
};

IntroPopup.defaultProps = {
  currentLanguage: '',
};

IntroPopup.contextTypes = {
  config: PropTypes.shape({
    introPopup: PropTypes.object,
    defaultLanguage: PropTypes.string,
  }).isRequired,
};

export default connectToStores(IntroPopup, ['PreferencesStore'], context => ({
  currentLanguage: context.getStore('PreferencesStore').getLanguage(),
}));
