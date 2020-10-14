import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import mockRouter from '../helpers/mock-router';
import {
  Component as EcoCounterContent,
  EcoCounterButton,
} from '../../../app/component/EcoCounterContent';

describe('<EcoCounterContent />', () => {
  it('should only show cycling button if only cycling data is available', () => {
    const props = {
      channel1: { siteData: [] },
      channel2: { siteData: [] },
      channel1Id: '1',
      channel2Id: '2',
      channels: [],
      changeUserType: () => {},
      changeDate: () => {},
      date: { format: () => '2018–01–30T12:34:56+00:00' },
      userType: 2,
      changeStep: () => {},
      step: 'day',
      availableUserTypes: [2],
      formatMessage: () => '',
      toggleView: () => {},
    };
    const wrapper = shallow(
      <EcoCounterContent directionAvailable {...props} />,
      {
        context: {
          router: mockRouter,
          location: {
            pathname: '',
            search: '',
            action: '',
          },
        },
      },
    );
    expect(
      wrapper.find('Icon[img="icon-icon_bicycle-withoutBox"]'),
    ).to.have.lengthOf(1);
    expect(wrapper.find('Icon')).to.have.lengthOf(2);
  });

  it('should only show walking button if only walking data is available', () => {
    const props = {
      channel1: { siteData: [] },
      channel2: { siteData: [] },
      channel1Id: '1',
      channel2Id: '2',
      channels: [],
      changeUserType: () => {},
      changeDate: () => {},
      date: { format: () => '2018–01–30T12:34:56+00:00' },
      userType: 1,
      changeStep: () => {},
      step: 'day',
      availableUserTypes: [1],
      formatMessage: () => '',
      toggleView: () => {},
    };
    const wrapper = shallow(
      <EcoCounterContent directionAvailable {...props} />,
      {
        context: {
          router: mockRouter,
          location: {
            pathname: '',
            search: '',
            action: '',
          },
        },
      },
    );
    expect(wrapper.find('Icon[img="icon-icon_walk"]')).to.have.lengthOf(1);
    expect(wrapper.find('Icon')).to.have.lengthOf(2);
  });

  it('should render all buttons', () => {
    const props = {
      channel1: { siteData: [] },
      channel2: { siteData: [] },
      channel1Id: '1',
      channel2Id: '2',
      channels: [],
      changeUserType: () => {},
      changeDate: () => {},
      date: { format: () => '2018–01–30T12:34:56+00:00' },
      userType: 1,
      changeStep: () => {},
      step: 'day',
      availableUserTypes: [1, 2],
      formatMessage: () => '',
      toggleView: () => {},
    };
    const wrapper = shallow(
      <EcoCounterContent directionAvailable {...props} />,
      {
        context: {
          router: mockRouter,
          location: {
            pathname: '',
            search: '',
            action: '',
          },
        },
      },
    );
    expect(wrapper.find('.button-row')).to.have.lengthOf(2);
    expect(wrapper.find(EcoCounterButton)).to.have.lengthOf(6);
  });
});
