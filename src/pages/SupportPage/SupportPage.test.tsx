// react libraries
import { Location } from 'history';
import * as React from 'react';

// third party
import {mount, shallow} from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

// components
import {
  SupportPage, mapDispatchToProps, mapStateToProps
} from './index';

describe('The Support Page', () => {
  let wrapper;
  let props;
  let waterCyclesPageInstance;

  props = {
    displaySnackMessage: jest.fn(() => Promise.resolve()),
  }

  beforeEach(() => {
    wrapper = shallow(
      <BrowserRouter>
        <SupportPage {...props}/>
    </BrowserRouter>
  );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('mapStateToProps', () => {
    const state = {
      error: '',
    };

    const props = mapStateToProps(state);

    it('should map support page props from state', () => {
      expect(props.error).toEqual(state.error);
    });
  });

  describe('mapDispatchToProps', () => {
    let dispatch;
    let props;

    beforeEach(() => {
      dispatch = jest.fn();
      props = mapDispatchToProps(dispatch) as any;
    });

    afterEach(() => {
      dispatch = props = null;
    })

    it('ensures displaySnackMessage is mapped to props', () => {
      props.displaySnackMessage();
      expect(dispatch).toHaveBeenCalled();
    })
  });
});