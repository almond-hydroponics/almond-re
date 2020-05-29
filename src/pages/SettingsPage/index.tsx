// react libraries
import * as React from 'react';

// third-party libraries
import { Cell, Grid, Row } from '@material/react-layout-grid';
import {connect} from "react-redux";

// components
const GeneralCardInfo = React.lazy(() => import('@components/GeneralInfoCard'));
import {
  Settings
} from '@material-ui/icons';

// thunk
import { displaySnackMessage } from "@modules/snack";

// interfaces
import { SettingsPageProps } from '@pages/SettingsPage/interfaces';

export const SettingsPage: React.FunctionComponent<SettingsPageProps> = (props) => {
  return (
    <React.Fragment>
      <Grid>
        <Row>
          <Cell columns={7} desktopColumns={7} tabletColumns={8}
                phoneColumns={4}>
            {(window.innerWidth < 539) &&
            <div className="main-subheader"><h3>Settings</h3></div>}
          </Cell>
        </Row>
        <Row>
          <Cell columns={12} desktopColumns={12} tabletColumns={8} phoneColumns={4}>
            <GeneralCardInfo
              mainHeader="Settings"
              subHeader="Adjust your preferences for better experience"
              icon={<Settings className="content-icon general-info-icon" />}
            />
          </Cell>
        </Row>
      </Grid>
    </React.Fragment>
  )
}

export const mapStateToProps = state => ({
  error: state.error,
});

export const mapDispatchToProps = dispatch => ({
  displaySnackMessage: message => dispatch(displaySnackMessage(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
