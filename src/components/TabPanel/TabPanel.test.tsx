// react libraries
import React from 'react';

// third-party libraries
import { render, screen } from '@testing-library/react';

// component
import TabPanel from './index';

describe('TabPanel component', () => {
	const props = {
		index: 1,
		value: 1,
	};

	const { asFragment } = render(<TabPanel {...props} />);

	it('should render correctly', () => {
		expect(asFragment()).toMatchSnapshot();

		const elem = screen.getByTestId('tab-panel');
		expect(elem.classList[0]).toBe('tab-panel');
	});
});