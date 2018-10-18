import PropTypes from 'prop-types';
import React from 'react';
import ComponentUsageExample from './ComponentUsageExample';

class ImageSlider extends React.Component {
  static FIRST = 0;

  constructor(props, context) {
    super(props);
    this.state = {
      active: ImageSlider.FIRST,
    };
  }

  changeActive = (active) => {
    this.setState({
      active: active,
    });
  }

  next = () => {
    const { children } = this.props;
    const { active } = this.state;
    const next = ((active + 1) === children.length) ? ImageSlider.FIRST : (active + 1);

    this.setState({
      active: next,
    });
  }

  prev = () => {
    const { children } = this.props;
    const { active } = this.state;
    const prev = (active === ImageSlider.FIRST) ? (children.length - 1) : (active - 1);

    this.setState({
      active: prev,
    });
  }

  render() {
    const { children } = this.props;
    const { active } = this.state;

    return (
      <div className="image-slider">
        <div className="slides">
          {React.Children.map(children, (item, i) => {
            const className = ((item.props.className || '') + (i === active ? ' active' : '')).trim();
            const props = { ...item.props, className: className };
            return React.cloneElement(item, props);
          })}
        </div>
        <div className="nav">
          {React.Children.map(children, (item, i) => (
            <span onClick={() => this.changeActive(i)} className={(i === active ? 'active' : '')}></span>
          ))}
        </div>
        <div className="prev" onClick={this.prev}></div>
        <div className="next" onClick={this.next}></div>
      </div>
    )
  }
};

ImageSlider.displayName = 'ImageSlider';

ImageSlider.description = (
  <div>
    <p>Image slider wrapper</p>
    <ComponentUsageExample description="">
      <ImageSlider>
        <img src="" alt=""/>
        <img src="" alt=""/>
      </ImageSlider>
    </ComponentUsageExample>
  </div>
);

ImageSlider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ImageSlider;
