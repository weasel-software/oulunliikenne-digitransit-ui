import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import ComponentUsageExample from './ComponentUsageExample';
import Icon from './Icon';
import SplitBars from './SplitBars';
import Favourite from './Favourite';

const CardHeader = ({
  className,
  children,
  headingStyle,
  name,
  description,
  code,
  icon,
  icons,
  unlinked,
  iconColor,
}) => (
  <div className={cx('card-header', className)}>
    {children}
    {icon ? (
      <div
        className="left"
        style={{ fontSize: 32, paddingRight: 10, height: 32 }}
      >
        <Icon img={icon} color={iconColor} />
      </div>
    ) : null}
    {className === 'stop-page header' && (
      <div className="stop-page-header_icon-container">
        <Icon img="icon-icon_bus-stop" className="stop-page-header_icon" />
      </div>
    )}
    <div className="card-header-wrapper">
      <span className={headingStyle || 'h5'}>
        {name}
        {unlinked ? null : <span className="link-arrow"> ›</span>}
      </span>
      <div className="card-sub-header">
        {code != null ? <p className="card-code">{code}</p> : null}
        {description != null && description !== 'null' ? (
          <p className="sub-header-h4">{description}</p>
        ) : null}
      </div>
    </div>
    {icons ? <SplitBars>{icons}</SplitBars> : null}
  </div>
);

const emptyFunction = () => {};
const exampleIcons = [
  <Favourite key="favourite" favourite={false} addFavourite={emptyFunction} />,
];

CardHeader.displayName = 'CardHeader';

CardHeader.description = () => (
  <div>
    <p>
      Generic card header, which displays card name, description, favourite star
      and optional childs
    </p>
    <ComponentUsageExample description="">
      <CardHeader
        name="Testipysäkki"
        description="Testipysäkki 2"
        code="7528"
        icons={exampleIcons}
        headingStyle="header-primary"
      />
    </ComponentUsageExample>
  </div>
);

CardHeader.propTypes = {
  className: PropTypes.string,
  headingStyle: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  code: PropTypes.string,
  icon: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  children: PropTypes.node,
  unlinked: PropTypes.bool,
  iconColor: PropTypes.string,
};

export default CardHeader;
