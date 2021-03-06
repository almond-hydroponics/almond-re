import 'core-js/stable';
// react libraries
import { StrictMode } from 'react';
import { render } from 'react-dom';
// third party packages
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// components
import App from './App';
// helper functions
import store from './store';

const rootNode = document.getElementById('root');

render(
	// <StrictMode>
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
	// </StrictMode>,
	rootNode,
);
