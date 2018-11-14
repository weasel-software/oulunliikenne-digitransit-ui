import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from './Icon';

class ContentToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      show: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      loaded: true,
    });
  };

  setContentRef = node => {
    this.contentRef = node;
  };

  toggleClickListener = () => {
    if (!this.state.show) {
      document.addEventListener('click', this.checkClickLocation, false);
    } else {
      document.removeEventListener('click', this.checkClickLocation, false);
    }
  };

  toggle = () => {
    if (this.props.onToggle) {
      this.props.onToggle(!this.state.show);
    }
    this.toggleClickListener();
    this.setState({
      show: !this.state.show,
    });
  };

  checkClickLocation = e => {
    if (this.checkClickInsideOfContent(e.target)) {
      return;
    }
    this.toggle();
  };

  checkClickInsideOfContent = target =>
    this.contentRef && this.contentRef.contains(target);

  render() {
    const { show, loaded } = this.state;
    const { icon, iconClass, toggleDisabled, active, children } = this.props;

    if (toggleDisabled) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    return [
      <React.Fragment key="toggleItem1">
        {React.Children.map(children, child => {
          const className = cx(child.props.className, {
            hidden: !show && !active,
            loaded,
          });
          const props = {
            ...child.props,
            className,
            ref: this.setContentRef,
          };
          return React.cloneElement(child, props);
        })}
      </React.Fragment>,
      !show &&
        !active && (
          <button
            key="toggleItem2"
            onClick={this.toggle}
            className={cx(iconClass)}
          >
            {icon && <Icon img={`icon-${icon}`} />}
          </button>
        ),
    ];
  }
}

ContentToggle.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  iconClass: PropTypes.string,
  toggleDisabled: PropTypes.bool,
  active: PropTypes.bool,
  onToggle: PropTypes.func,
};

ContentToggle.defaultProps = {
  icon: undefined,
  iconClass: undefined,
  toggleDisabled: false,
  active: false,
  onToggle: undefined,
};

export default ContentToggle;
