export interface EnterDeviceIdPageProps {
  verifyUserDevice: (id) => Promise<any>;
  displaySnackMessage?: (message) => Promise<any>;
  error?: object;
  isLoading: boolean;
}

export interface EnterDeviceIdPageState {
  isLoading: boolean;
}
