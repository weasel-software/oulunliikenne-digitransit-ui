import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { Component as EcoCounterContent } from '../../../app/component/EcoCounterContent';

describe('<EcoCounterContent />', () => {
  it('should only show cycling button if only cycling data is available', () => {
    const props = {
      data: { inData: [], outData: [] },
      changeUserType: () => {},
      userType: 2,
      changeStep: () => {},
      step: 'day',
      availableUserTypes: [2],
      formatMessage: () => '',
    };
    const wrapper = shallow(
      <EcoCounterContent directionAvailable {...props} />,
    );
    expect(
      wrapper.find('Icon[img="icon-icon_bicycle-withoutBox"]'),
    ).to.have.lengthOf(1);
    expect(wrapper.find('Icon')).to.have.lengthOf(1);
  });

  it('should only show walking button if only walking data is available', () => {
    const props = {
      data: { inData: [], outData: [] },
      changeUserType: () => {},
      userType: 1,
      changeStep: () => {},
      step: 'day',
      availableUserTypes: [1],
      formatMessage: () => '',
    };
    const wrapper = shallow(
      <EcoCounterContent directionAvailable {...props} />,
    );
    expect(wrapper.find('Icon[img="icon-icon_walk"]')).to.have.lengthOf(1);
    expect(wrapper.find('Icon')).to.have.lengthOf(1);
  });

  it('should render all buttons', () => {
    const props = {
      data: { inData: [], outData: [] },
      changeUserType: () => {},
      userType: 1,
      changeStep: () => {},
      step: 'day',
      availableUserTypes: [1, 2],
      formatMessage: () => '',
    };
    const wrapper = shallow(
      <EcoCounterContent directionAvailable {...props} />,
    );
    expect(wrapper.find('.button-row')).to.have.lengthOf(2);
    expect(wrapper.find('.ecocounter-button')).to.have.lengthOf(6);
  });
});
