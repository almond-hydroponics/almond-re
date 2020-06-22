// react libraries
import * as React from 'react';

// third-party libraries
import { shallow } from 'enzyme';

// component
import AreaChardDisplay from "./index";

describe('AreaChartDisplay component', () => {
  const props = {
    chartData: [15, 16, 20, 27, 21, 24, 21, 19, 16],
    chartColor: '#1967D2',
    backgroundColor: '#1967D2',
  };

  const wrapper = shallow(<AreaChardDisplay {...props} />);

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  })
});