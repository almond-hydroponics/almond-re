// thunks
import { displaySnackMessage } from './index';

// helper functions
import { reduxMockStore } from '../../../testHelpers';

// types
import { DISPLAY_SNACK_MESSAGE } from './types';

describe('The snack action', () => {
  const snackMessageInitialState = {};

  it('should display a snack message', () => {
    const snackMessage = 'Welcome to Kari4me';
    const expectedAction = {
      snack: {
        message: snackMessage,
        withName: false,
      },
      type: DISPLAY_SNACK_MESSAGE,
    };
    const store = reduxMockStore({}, snackMessageInitialState);

    store.dispatch(displaySnackMessage(snackMessage));
    expect(store.getActions()[0]).toEqual(expectedAction);
  });
});
