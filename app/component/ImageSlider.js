import PropTypes from 'prop-types';
import React from 'react';
import ComponentUsageExample from './ComponentUsageExample';
import Icon from './Icon';

class ImageSlider extends React.Component {
  static FIRST = 0;

  constructor(props) {
    super(props);
    this.state = {
      active: ImageSlider.FIRST,
    };
  }

  changeActive = active => {
    this.setState({
      active,
    });
  };

  next = () => {
    const { children } = this.props;
    const { active } = this.state;
    const next =
      active + 1 === children.length ? ImageSlider.FIRST : active + 1;

    this.setState({
      active: next,
    });
  };

  prev = () => {
    const { children } = this.props;
    const { active } = this.state;
    const prev =
      active === ImageSlider.FIRST ? children.length - 1 : active - 1;

    this.setState({
      active: prev,
    });
  };

  render() {
    const { children } = this.props;
    const { active } = this.state;

    return (
      <div
        className="image-slider"
        role="tablist"
        tabIndex={-1}
        onKeyDown={evt => {
          if (evt.which === 37) {
            this.prev();
          } else if (evt.which === 39) {
            this.next();
          }
        }}
      >
        <div className="slides">
          {React.Children.map(children, (item, i) => {
            const className = (
              (item.props.className || '') + (i === active ? ' active' : '')
            ).trim();
            const props = { ...item.props, className };
            return React.cloneElement(item, props);
          })}
        </div>
        {children.length > 1 && [
          <div className="nav" key="nav">
            {React.Children.map(children, (item, i) => (
              <span
                onClick={() => this.changeActive(i)}
                onKeyDown={evt => {
                  if (evt.which === 32) {
                    this.changeActive(i);
                  }
                }}
                className={i === active ? 'active' : ''}
                role="button"
                tabIndex={i + 1}
              />
            ))}
          </div>,
          <div
            className="prev"
            onClick={this.prev}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}
            key="prev"
          >
            <Icon img="icon-icon_arrow-collapse--left" />
          </div>,
          <div
            className="next"
            onClick={this.next}
            onKeyDown={() => {}}
            role="button"
            tabIndex={-1}
            key="next"
          >
            <Icon img="icon-icon_arrow-collapse--right" />
          </div>,
        ]}
      </div>
    );
  }
}

ImageSlider.displayName = 'ImageSlider';

ImageSlider.description = (
  <div>
    <p>Image slider wrapper</p>
    <ComponentUsageExample description="">
      <ImageSlider>
        <img src="" alt="" />
        <img src="" alt="" />
      </ImageSlider>
    </ComponentUsageExample>
  </div>
);

ImageSlider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ImageSlider;
