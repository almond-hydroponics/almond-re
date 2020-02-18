import { DISPLAY_SNACK_MESSAGE } from './types';

export interface DisplaySnackMessageAction {
  type: DISPLAY_SNACK_MESSAGE;
  snack: SnackMessage;
}

export interface SnackMessage {
  message: string | null | undefined;
}
