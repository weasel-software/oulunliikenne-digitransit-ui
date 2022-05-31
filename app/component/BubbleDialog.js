import cx from 'classnames';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import React from 'react';
import withOutsideClick from 'react-click-outside';
import { intlShape } from 'react-intl';
import { routerShape } from 'react-router';

import Icon from './Icon';
import LazilyLoad, { importLazy } from './LazilyLoad';
import {
  getDrawerWidth,
  getIsBrowser,
  isBrowser,
  isKeyboardSelectionEvent,
} from '../util/browser';
import withBreakpoint from '../util/withBreakpoint';

class BubbleDialog extends React.Component {
  constructor(props, context) {
    super(props);

    this.dialogContentRef = React.createRef();
    this.toggleDialogRef = React.createRef();
    this.state = {
      isOpen: this.getDialogState(context),
    };
  }

  getDialogState = context => {
    const { router } = context;
    const location = router.getCurrentLocation();
    return location.state && location.state[this.props.id] === true;
  };

  setDialogState = (isOpen, callback) => {
    if (this.state.isOpen === isOpen) {
      return;
    }
    this.setState({ isOpen }, () => {
      const { router } = this.context;
      const location = router.getCurrentLocation();
      router.replace({
        ...location,
        state: {
          ...location.state,
          [this.props.id]: isOpen,
        },
      });
      callback();
    });
  };

  modules = {
    Drawer: () => importLazy(import('material-ui/Drawer')),
  };

  handleClickOutside() {
    this.closeDialog();
  }

  openDialog = (applyFocus = false) => {
    this.setDialogState(true, () => {
      if (isFunction(this.props.onDialogOpen)) {
        this.props.onDialogOpen(applyFocus);
      } else if (applyFocus && this.dialogContentRef.current) {
        this.dialogContentRef.current.focus();
      }
    });
  };

  closeDialog = (applyFocus = false) => {
    this.setDialogState(false, () => {
      if (applyFocus && this.toggleDialogRef.current) {
        this.toggleDialogRef.current.focus();
      }
    });
  };

  renderContent(isFullscreen) {
    const { breakpoint, children, contentClassName, header } = this.props;
    const { intl } = this.context;
    const isLarge = breakpoint === 'large';
    return (
      <div
        className={cx('bubble-dialog-container', {
          'bubble-dialog-container--fullscreen': isFullscreen,
        })}
      >
        <div
          className={cx('bubble-dialog', {
            'bubble-dialog--fullscreen': isFullscreen,
            'bubble-dialog--large': isLarge,
          })}
        >
          <div
            className={cx('bubble-dialog-header-container', {
              'bubble-dialog-header-container--fullscreen': isFullscreen,
            })}
          >
            <span
              className={cx('bubble-dialog-header', {
                'bubble-dialog-header--fullscreen': isFullscreen,
              })}
            >
              {intl.formatMessage({
                id: header,
                defaultMessage: 'Bubble Dialog Header',
              })}
            </span>
            <button
              className={cx('bubble-dialog-close', {
                'bubble-dialog-close--fullscreen': isFullscreen,
              })}
              onClick={() => this.closeDialog()}
              onKeyDown={e =>
                isKeyboardSelectionEvent(e) && this.closeDialog(true)
              }
              aria-label={intl.formatMessage({
                id: 'close',
                defaultMessage: 'Close',
              })}
            >
              <Icon img="icon-icon_close" />
            </button>
          </div>
          <div
            className={cx('bubble-dialog-content', contentClassName, {
              'bubble-dialog-content--fullscreen': isFullscreen,
              'bubble-dialog-content--large': isLarge,
            })}
            ref={this.dialogContentRef}
            tabIndex="-1"
          >
            {children}
          </div>
          <div
            className={cx('bubble-dialog-buttons', {
              collapsed: !isFullscreen,
            })}
          >
            <button
              className="standalone-btn"
              onClick={() => this.closeDialog()}
              onKeyDown={e =>
                isKeyboardSelectionEvent(e) && this.closeDialog(true)
              }
            >
              {intl.formatMessage({
                id: 'dialog-return-to-map',
                defaultMessage: 'Return to map',
              })}
            </button>
          </div>
        </div>
        <div
          className={cx('bubble-dialog-tip-container', {
            collapsed: isFullscreen,
          })}
        >
          <div className="bubble-dialog-tip" />
        </div>
      </div>
    );
  }

  renderContainer(isFullscreen) {
    const isOpen = this.state.isOpen || this.props.isOpen;
    const { intl } = this.context;
    return (
      <div
        className={cx(
          'bubble-dialog-component-container',
          this.props.containerClassName,
        )}
      >
        <button
          className="bubble-dialog-toggle"
          aria-label={this.props.toggleButtonTitle}
          title={this.props.toggleButtonTitle}
          onClick={() => (isOpen ? this.closeDialog() : this.openDialog())}
          onKeyDown={e =>
            isKeyboardSelectionEvent(e) &&
            (isOpen ? this.closeDialog(true) : this.openDialog(true))
          }
          ref={this.toggleDialogRef}
          tabIndex="0"
        >
          {this.props.buttonText &&
            intl.formatMessage({
              id: this.props.buttonText,
              defaultMessage: 'Bubble Dialog Button',
            })}
          <Icon img={`icon-icon_${this.props.icon}`} viewBox="0 0 25 25" />
        </button>
        {isFullscreen ? (
          <LazilyLoad modules={this.modules}>
            {({ Drawer }) => (
              <Drawer
                containerStyle={{
                  maxHeight: '100vh',
                }}
                disableSwipeToOpen
                docked={false}
                open={isOpen}
                openSecondary
                width={getDrawerWidth(window)}
              >
                {this.renderContent(true)}
              </Drawer>
            )}
          </LazilyLoad>
        ) : (
          isOpen && this.renderContent(false)
        )}
      </div>
    );
  }

  render = () => {
    if (!isBrowser && !getIsBrowser()) {
      return null;
    }
    const { breakpoint, isFullscreenOnMobile } = this.props;
    const isFullscreen = breakpoint !== 'large' && isFullscreenOnMobile;
    return this.renderContainer(isFullscreen);
  };
}

BubbleDialog.propTypes = {
  breakpoint: PropTypes.oneOf(['small', 'medium', 'large']),
  children: PropTypes.node,
  containerClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  header: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  isFullscreenOnMobile: PropTypes.bool,
  isOpen: PropTypes.bool,
  onDialogOpen: PropTypes.func,
  toggleButtonTitle: PropTypes.string,
};

BubbleDialog.defaultProps = {
  breakpoint: 'small',
  children: null,
  containerClassName: undefined,
  contentClassName: undefined,
  buttonText: undefined,
  isFullscreenOnMobile: false,
  isOpen: false,
  onDialogOpen: undefined,
  toggleButtonTitle: '',
};

BubbleDialog.contextTypes = {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
};

const enhancedComponent = withOutsideClick(
  withBreakpoint(BubbleDialog, { forwardRef: true }),
);

export { enhancedComponent as default, BubbleDialog as Component };
