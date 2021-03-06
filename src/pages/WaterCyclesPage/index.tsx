import { useState, useEffect, useContext, ChangeEvent } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
// third-party libraries
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { MobileTimePicker, LocalizationProvider } from '@material-ui/lab';
import {
	Grid,
	Stack,
	Button,
	IconButton,
	InputAdornment,
	Switch,
	TextField,
} from '@material-ui/core';
// import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import withStyles from '@material-ui/core/styles/withStyles';
import { createStyles, makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { NoDataOverlay, LinearProgressBar } from '@components/atoms';
import {
	GridCellParams,
	GridColDef,
	DataGrid,
	GridSortDirection,
	GridOverlay,
} from '@material-ui/data-grid';
// components
import Modal from '@components/atoms/Modal';
import {
	GeneralCardInfo,
	DashboardCard,
	DateRangePicker,
} from '@components/molecules';
import { LineChartCard, DonutDisplay } from '@components/organisms';
// icons
import { BlurCircular, AddAlarmTwoTone, Add } from '@material-ui/icons';
import { ComponentContext } from '@context/ComponentContext';
import { UserContext } from '@context/UserContext';
// thunks
import {
	addNewSchedule,
	deleteSingleSchedule,
	editSchedule,
	getAllSchedules,
	getPumpStatus,
	togglePump,
	toggleScheduleStatus,
} from '@modules/timeSchedules';
import { getAirTemperatureTrend } from '@modules/sensorData';
// utils
import {
	validateNewOneHourTime,
	validateEditOneHourTime,
} from '@utils/validateTimeOneHour';
import roundDigit from '@utils/roundDigit';
import dayjs from '@utils/dayjsTime';
import { ToggleSwitch, useTableStyles } from '@pages/WaterCyclesPage/styles';
import { DateRanges } from '@components/molecules/DateRangePicker/interfaces';
import getDateRange from '@utils/DateRangeSelect';
// interfaces
import {
	dateObjectValues,
	dateSelectOptions,
	timeWindowRange,
} from '@components/organisms/LineChartCard/fixtures';
import { Theme } from '@material-ui/core/styles';
import { WaterCyclesPageState } from './interfaces';
import { primaryColor } from '../../assets/tss/common';
import { IRootState } from '../../store/rootReducer';

const cardPumpIllustration =
	'https://storage.googleapis.com/static.almondhydroponics.com/static/images/aeroponics.jpeg';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		blankContent: {
			// marginTop: 40,
			// marginBottom: 40,
			fontFamily: 'San Francisco, serif !important',
			fontSize: 30,
			fontWeight: 300,
			letterSpacing: -2,
			wordSpacing: 2,
		},
		'& .super-app-theme--header': {
			color: theme.palette.text.primary,
			// fontWeight: 500,
		},
	}),
);

export const BlankContent = ({
	message,
}: {
	message: string;
}): JSX.Element => {
	const classes = useStyles();
	return (
		<Typography
			variant="h6"
			color="textSecondary"
			className={classes.blankContent}
		>
			{message}
		</Typography>
	);
};

export const CustomLoadingOverlay = () => {
	return (
		<GridOverlay>
			<div style={{ position: 'absolute', top: 0, width: '100%' }}>
				<LinearProgressBar />
			</div>
		</GridOverlay>
	);
};

export const WaterCyclesPage = (): JSX.Element => {
	const { schedules, isLoading, enabled } = useSelector(
		(globalState: IRootState) => globalState.timeSchedules,
		shallowEqual,
	);
	const { waterLevel } = useSelector(
		(globalState: IRootState) => globalState.sensorData?.sensorData,
		shallowEqual,
	);
	const { airTemperatureTrend } = useSelector(
		(globalState: IRootState) => globalState.sensorData,
		shallowEqual,
	);

	const dispatch = useDispatch();
	const [state, setState] = useState<WaterCyclesPageState>({
		isEditMode: false,
		isDeleteModalOpen: false,
		scheduleId: '',
		statusClass: '',
		isEnabled: false,
		isAddEditModalOpen: false,
		scheduleToEdit: '',
		isActionDone: false,
		isLoading: false,
		isDateRangeHidden: false,
		currentDateInView: '',
		waterCardDateRange: 'Last 4 hours',
		selectedTimeSchedule: dayjs(),
		hasError: false,
		schedules: [
			{
				_id: '',
				schedule: '',
				enabled: false,
				createdAt: '',
				updatedAt: '',
				user: '',
			},
		],
	});

	const classes = useStyles();
	const tableClasses = useTableStyles();
	const { setDeviceModalOpen } = useContext(ComponentContext);
	const { activeDevice } = useContext(UserContext);

	// const sensorData = useSelector(selectTemperatureData)
	// const timeSchedules = useSelector(state => state)
	// const schedules = [{
	//   _id: '',
	//   id: '',
	//   schedule: '',
	//   enabled: false,
	//   createdAt: '',
	//   updatedAt: '',
	//   user: '',
	// }]
	// const enabled = true
	// const waterTemperatureTrend = []
	// const data = useMemo(sensorDataSelector, [])
	// const dataSensor = useSelector((state: IRootState) => data(state))
	// console.log('Class: , Function: WaterCyclesPage, Line 152 sensorDate():', dataSensor);

	useEffect(() => {
		dispatch(getAllSchedules(activeDevice?._id));
	}, [activeDevice?._id]);

	useEffect(() => {
		dispatch(getPumpStatus(activeDevice?._id));
	}, [activeDevice?._id]);

	useEffect(() => {
		const ranges = getDateRange('Today');

		// http://localhost:8081/api/range-data?start=-1d&measurement=temperature&type=window&window=10h

		const queryParams = {
			start: '-1d',
			type: 'window',
			window: '10h',
			// stop: ranges.endDate,
			measurement: 'temperature',
		};
		dispatch(getAirTemperatureTrend(queryParams));
	}, []);

	// useEffect(() => {
	//   props.getWaterData();
	// }, []);

	// React.useEffect(() => {
	//   const { scheduleToEdit } = state;
	//   const schedules = [...new Set(props.schedules.map(item => item.schedule))];
	//   const validateEdit = validateOneHourTime(schedules, scheduleToEdit);
	//   if (validateEdit) {
	//     setState({ ...state, hasError: true });
	//   } else if (validateEdit === false || undefined) {
	//     setState({ ...state, hasError: false });
	//   }
	// },              [state.scheduleToEdit]);

	const heightOfTank = 600; // units in centimeters
	const waterLevelData = heightOfTank
		? waterLevel || heightOfTank
		: heightOfTank;
	const heightOfWater = roundDigit(
		((heightOfTank - waterLevelData) / heightOfTank) * 100,
		0,
	);

	const PumpSwitch = withStyles({
		switchBase: {
			color: '#FFFFFF',
			'&$checked': {
				color: primaryColor,
			},
			'&$checked + $track': {
				backgroundColor: primaryColor,
			},
		},
		thumb: {
			width: 20,
			height: 20,
			animation: '$blink 1s ease infinite',
		},
		checked: {},
		track: {
			borderRadius: 20,
		},
		'@keyframes blink': {
			'50%': {
				transform: 'scale (1)',
				backgroundColor: primaryColor,
			},
		},
	})(Switch);

	// eslint-disable-next-line no-console
	const handleClick = (message: string) => console.log(message);
	// mqtt?.publish('almond/pump', message);

	const handleTogglePumpOnChange = async (event) => {
		const { checked } = event.target;
		await handleClick(checked ? '1' : '0');
		await dispatch(
			togglePump({
				enabled: checked,
				device: activeDevice?._id,
			}),
		);
	};

	const handleToggleStatusChange = async (event, schedule) => {
		const { checked } = event.target;
		await dispatch(
			toggleScheduleStatus(schedule, {
				enabled: checked,
				device: activeDevice._id,
			}),
		);
	};

	const handleAddTimeSchedule = (value) => {
		validateNewTime(value);
		setState((prevState) => ({
			...prevState,
			selectedTimeSchedule: value,
		}));
	};

	const validateNewTime = (value) => {
		const timeSchedules = schedules.map((schedule) => schedule?.schedule);
		const isNotWithinOneHour = validateNewOneHourTime(timeSchedules, value);
		if (isNotWithinOneHour) {
			setState((prevState) => ({ ...prevState, hasError: false }));
		} else {
			setState((prevState) => ({ ...prevState, hasError: true }));
		}
	};

	const validateScheduleOnOpen = (): void => {
		const { selectedTimeSchedule } = state;
		validateNewTime(selectedTimeSchedule);
	};

	const handleEditTimeChange = (value): void => {
		setState((prevState) => ({
			...prevState,
			scheduleToEdit: value,
		}));
		validateEditTime(value);
	};

	const validateEditTime = (value): void => {
		const { scheduleId } = state;
		const isNotWithinOneHour = validateEditOneHourTime(
			schedules,
			scheduleId,
			value,
		);

		if (isNotWithinOneHour) {
			setState((prevState) => ({ ...prevState, hasError: false }));
		} else {
			setState((prevState) => ({ ...prevState, hasError: true }));
		}
	};

	const showScheduleModal =
		(mode: string) =>
		(event): void => {
			event.preventDefault();
			const { id } = event.target;
			const schedule = schedules.filter((obj) => obj._id === id);
			const setEditTimeValue = (time) => {
				const [hour, minute] = time.split(':');
				return dayjs().hour(hour).minute(minute).format();
			};

			switch (mode) {
				case 'Add':
					setState((prevState) => ({
						...prevState,
						isAddEditModalOpen: !prevState.isAddEditModalOpen,
						isEditMode: false,
					}));
					break;
				case 'Edit':
					setState((prevState) => ({
						...prevState,
						scheduleId: id,
						scheduleToEdit: setEditTimeValue(schedule[0].schedule),
						isAddEditModalOpen: !prevState.isAddEditModalOpen,
						isEditMode: true,
					}));
					break;
				default:
					setState((prevState) => ({
						...prevState,
					}));
			}
			validateScheduleOnOpen();
		};

	const closeScheduleModal = (): void => {
		setState((prevState) => ({
			...prevState,
			isAddEditModalOpen: !prevState.isAddEditModalOpen,
		}));

		setTimeout(
			() =>
				setState((prevState) => ({
					...prevState,
					selectedTimeSchedule: dayjs(),
					hasError: false,
					isEditMode: false,
					scheduleId: '',
				})),
			1000,
		);
	};

	const toggleScheduleDeleteModal = (): void => {
		setState((prevState) => ({
			...prevState,
			isDeleteModalOpen: !prevState.isDeleteModalOpen,
		}));
	};

	const handleScheduleDelete = async (event): Promise<void> => {
		event.preventDefault();
		await dispatch(deleteSingleSchedule(state.scheduleId));
		toggleScheduleDeleteModal();
	};

	const onAddEditScheduleSubmit = (event): void => {
		event.preventDefault();
		const { isEditMode, scheduleId, scheduleToEdit, selectedTimeSchedule } =
			state;
		const timeValueString = (value) => dayjs(value).format('HH:mm');

		const schedule = {
			schedule: isEditMode
				? timeValueString(scheduleToEdit)
				: timeValueString(selectedTimeSchedule),
			device: activeDevice._id,
		};

		dispatch(
			isEditMode
				? editSchedule(scheduleId, schedule)
				: addNewSchedule(schedule),
		);

		closeScheduleModal();
	};

	const handleDateRangeModal = () => {
		setState((prevState) => ({
			...prevState,
			isDateRangeHidden: !prevState.isDateRangeHidden,
		}));
	};

	const onDateRangeChange = (range: DateRanges) => {
		handleDateRangeModal();
		console.log(
			'Class: , Function: onDateRangeChange, Line 324 range():',
			range,
		);
	};

	// const currentDateView = (frequency: string) => {
	// 	setState((prevState) => ({
	// 		...prevState,
	// 		currentDateInView: frequency,
	// 	}));
	// };

	const handleDateSelect = (index) => {
		const value = dateSelectOptions[index.group][index.item];

		setState((prevState) => ({
			...prevState,
			waterCardDateRange: value,
		}));

		if (value === 'Pick a date') {
			setState((prevState) => ({
				...prevState,
				isDateRangeHidden: !prevState.isDateRangeHidden,
			}));
		}

		const range = {
			startDate: new Date(),
			endDate: new Date(),
		};
		// const date = getDateRange(param, range, currentDateView);
		// const queryParams = {
		// q: `time >= '${date.startDate}' and time <= '${date.endDate}'`,
		// };
		const dateParams = dateObjectValues[value as string];
		const ranges = getDateRange(value);

		const queryParams = {
			start: ranges.startDate,
			stop: ranges.endDate,
			measurement: 'temperature',
		};

		dispatch(getAirTemperatureTrend(queryParams));
	};

	const renderTimeScheduleForm = (): JSX.Element => {
		const { isEditMode, selectedTimeSchedule, scheduleToEdit, hasError } =
			state;

		return (
			<>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<MobileTimePicker
						label="time schedule"
						value={isEditMode ? scheduleToEdit : selectedTimeSchedule}
						onChange={
							isEditMode ? handleEditTimeChange : handleAddTimeSchedule
						}
						renderInput={(params) => (
							<TextField
								{...params}
								fullWidth
								style={{ marginTop: 12 }}
								name="time_schedule"
								{...(hasError ? { error: true } : {})}
								{...(hasError
									? {
											helperText:
												'Schedule time has to be at least one hour apart',
									  }
									: {})}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IconButton>
												<AddAlarmTwoTone
													color={hasError ? 'error' : 'primary'}
												/>
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						)}
					/>
				</LocalizationProvider>
			</>
		);
	};

	const renderAddEditScheduleModal = (): JSX.Element => {
		const { isAddEditModalOpen, isEditMode, hasError } = state;
		return (
			<Modal
				isModalOpen={isAddEditModalOpen}
				renderContent={renderTimeScheduleForm()}
				onClose={closeScheduleModal}
				renderDialogText={`${
					isEditMode ? 'Change the' : 'Add a'
				} time schedule as per your preference for pumping.`}
				renderHeader={
					isEditMode ? 'Edit time schedule' : 'Create a new time schedule'
				}
				submitButtonName={
					isEditMode ? 'Update schedule' : 'Create new schedule'
				}
				onSubmit={onAddEditScheduleSubmit}
				onDismiss={closeScheduleModal}
				disabled={hasError}
			/>
		);
	};

	const renderDeleteScheduleModal = (): JSX.Element => (
		<Modal
			isModalOpen={state.isDeleteModalOpen}
			renderDialogText="Do you confirm deletion of time schedule?"
			onClose={toggleScheduleDeleteModal}
			renderHeader="Delete Time Schedule"
			submitButtonName="Delete schedule"
			onSubmit={handleScheduleDelete}
			onDismiss={toggleScheduleDeleteModal}
		/>
	);

	const renderActionButtons = (schedule: string): JSX.Element => {
		const handleDelete = () =>
			setState((prevState) => ({
				...prevState,
				scheduleId: schedule,
				isDeleteModalOpen: !prevState.isDeleteModalOpen,
			}));

		return (
			<div className={classes.root} key={schedule}>
				<Stack direction="row" spacing={1}>
					<Typography
						style={{ cursor: 'pointer', paddingRight: 12 }}
						id={schedule}
						variant="body2"
						color="primary"
						onClick={showScheduleModal('Edit')}
						onKeyDown={showScheduleModal('Edit')}
					>
						Edit
					</Typography>
					<Typography
						style={{ cursor: 'pointer', color: red[900] }}
						id={schedule}
						variant="body2"
						onClick={handleDelete}
						onKeyDown={handleDelete}
					>
						Delete
					</Typography>
				</Stack>
			</div>
		);
	};

	const renderTableContent = (): JSX.Element => {
		const columns: GridColDef[] = [
			{
				field: 'time',
				headerName: 'Time',
				flex: 0.3,
				headerClassName: 'table-header',
				cellClassName: 'table-cell',
			},
			{
				field: 'actions',
				headerName: 'Actions',
				flex: 0.4,
				headerClassName: 'table-header',
				renderCell: ({ value }: GridCellParams) =>
					renderActionButtons(value as string),
			},
			{
				field: 'status',
				headerName: 'Status',
				flex: 0.3,
				headerClassName: 'table-header',
				renderCell: ({ value, getValue }: GridCellParams) => (
					<ToggleSwitch
						checked={value as boolean}
						onChange={(e) =>
							handleToggleStatusChange(e, getValue('actions', 'status'))
						}
					/>
				),
			},
		];

		const rows = schedules.map((schedule) => ({
			id: schedule._id,
			time: schedule.schedule,
			actions: schedule._id,
			status: schedule.enabled,
		}));

		return (
			<div
				className={tableClasses.root}
				style={{ height: 400, width: '100%' }}
			>
				<div style={{ display: 'flex', height: '100%' }}>
					<div style={{ flexGrow: 1 }}>
						<DataGrid
							disableColumnMenu
							className={tableClasses.root}
							loading={isLoading}
							rows={rows}
							pageSize={5}
							columns={columns.map((column) => ({
								...column,
								disableClickEventBubbling: true,
							}))}
							components={{
								LoadingOverlay: CustomLoadingOverlay,
								NoRowsOverlay: NoDataOverlay,
							}}
							sortModel={[
								{
									field: 'time',
									sort: 'asc' as GridSortDirection,
								},
							]}
						/>
					</div>
				</div>
			</div>
		);
	};

	const firstColumn = () => (
		<Grid item container xs={12} md={4} spacing={2}>
			<GeneralCardInfo
				mainHeader="Manual Override"
				subHeader="Pump water directly into the system"
				icon={<BlurCircular />}
				actionItem={
					<PumpSwitch
						className="manual-override"
						onChange={handleTogglePumpOnChange}
						checked={enabled}
						inputProps={{ 'aria-label': 'primary checkbox' }}
					/>
				}
			/>
			<DashboardCard
				heading="Water Schedules"
				body={renderTableContent()}
				actionItem={
					<Button
						color="primary"
						size="small"
						variant="outlined"
						onClick={showScheduleModal('Add')}
					>
						<Add fontSize="small" />
						Add schedule
					</Button>
				}
			/>
		</Grid>
	);

	const secondColumn = () => (
		<Grid item container xs={12} md={5} spacing={2}>
			<LineChartCard
				heading="Water Temperature"
				selectedValue={state.waterCardDateRange}
				handleDateSelect={handleDateSelect}
				isDateRangeHidden={state.isDateRangeHidden}
				onDateRangeChange={onDateRangeChange}
				handleDateRangeModal={handleDateRangeModal}
				data={airTemperatureTrend}
				duration={timeWindowRange[state.waterCardDateRange]}
			/>
		</Grid>
	);

	const thirdColumn = () => (
		<Grid item container xs={12} md={2} spacing={2}>
			<DashboardCard
				heading="Water Tank Level"
				body={
					<DonutDisplay
						backgroundColor={['#CCCCCC', '#36A2EB']}
						hoverBackgroundColor={['#CCCCCC', '#2d9fec']}
						data={[waterLevelData, heightOfTank - waterLevelData]}
						donutInfo={`${heightOfWater}%`}
						halfDonut={false}
					/>
				}
			/>
		</Grid>
	);

	return (
		<div className={classes.root} data-testid="water-cycles-page">
			<Grid container spacing={2}>
				{firstColumn()}
				{secondColumn()}
				{thirdColumn()}
				{renderAddEditScheduleModal()}
				{renderDeleteScheduleModal()}
			</Grid>
		</div>
	);
};

export default WaterCyclesPage;
