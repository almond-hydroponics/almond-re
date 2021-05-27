// react libraries
import { useState, useEffect } from 'react';
// Third party libraries
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Chip,
	InputAdornment,
	TextField,
	useMediaQuery,
	Stack,
} from '@material-ui/core';
import {
	DataGrid,
	GridCellParams,
	GridColDef,
	GridSortDirection,
} from '@material-ui/data-grid';
import { DividerWithText, Image, NoDataOverlay } from '@components/atoms';
import { CustomLoadingOverlay } from '@pages/WaterCyclesPage';
// icons
import { Mood, Grain, Face, Add } from '@material-ui/icons';
// components
import { PermissionAccess, DashboardCard } from '@components/molecules';
import Grid from '@material-ui/core/Grid';
import Modal from '@components/atoms/Modal';
import Restrict from '@components/Restrict';
import { createStyles, makeStyles, withStyles } from '@material-ui/styles';
import { Theme, useTheme } from '@material-ui/core/styles';
// thunks
import {
	createUserRole,
	deleteUserRole,
	editUserRole,
	getUserRoles,
} from '@modules/userRoles';
import { displaySnackMessage } from '@modules/snack';
// styles
import { useTableStyles } from '@pages/WaterCyclesPage/styles';
import useFormState from '@hooks/useFormState';
// interfaces
import { UserRole } from '@modules/userRoles/interfaces';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import validate from 'validate.js';
import { UserRolesPageState } from './interfaces';
import { IRootState } from '../../store/rootReducer';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		blankContent: {
			marginTop: 40,
			marginBottom: 40,
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

const CustomTextField = withStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		marginBottom: '12px',
		'& input:valid + fieldset': {
			// borderColor: '#1967D2',
			borderWidth: 1,
		},
		'& input:invalid + fieldset': {
			borderColor: theme.palette.error,
			borderWidth: 2,
		},
		'& input:valid:focus + fieldset': {
			borderColor: theme.palette.primary.main,
			borderLeftWidth: 6,
			padding: '4px !important', // override inline-style
		},
	},
}))(TextField);

const schema = {
	roleName: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 50,
			message: 'description should not be more than 50 characters',
		},
	},
	roleDescription: {
		presence: { allowEmpty: false, message: 'is required' },
		length: {
			maximum: 100,
			message: 'description should not be more than 100 characters',
		},
	},
};

export const UserRolesPage = (): JSX.Element => {
	const { roles, resources, permissions, isLoading } = useSelector(
		(globalState: IRootState) => globalState.userRoles,
		shallowEqual,
	);
	const [state, setState] = useState<UserRolesPageState>({
		isRequestSent: false,
		isDeleteModalOpen: false,
		permissions: [],
		resources: [],
		selectedRole: {} as any,
		isAddEditModalOpen: false,
		isEditMode: false,
		action: '',
		roleId: '',
	});

	const dispatch = useDispatch();
	const tableClasses = useTableStyles();
	const classes = useStyles();

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		dispatch(getUserRoles());
	}, []);

	useEffect(() => {
		setState((prevState) => ({
			...prevState,
			permissions,
			resources,
		}));
	}, [resources, permissions]);

	const { values, isValid, errors, hasError, handleFormChange, handleSubmit } =
		useFormState({
			onSubmit: ({ roleName, roleDescription }) => {
				const updatedResources = state.resources
					.filter(
						(resource) =>
							resource.permissionIds !== undefined &&
							resource.permissionIds.length !== 0,
					)
					.map((resource) => ({
						resourceId: resource._id,
						name: resource.name,
						permissionIds: resource.permissionIds,
					}));

				const userRole = {
					title: roleName,
					description: roleDescription,
					resourceAccessLevels: updatedResources,
				};

				if (updatedResources.length === 0) {
					return dispatch(
						displaySnackMessage('Please, check at least one permission'),
					);
				}

				dispatch(createUserRole(userRole));
				onResetPermission();
				toggleAddRoleModal();
			},
			formErrors: (formValues) => validate(formValues, schema),
		});

	useEffect(() => {
		onResetPermission();
	}, [state.isAddEditModalOpen]);

	// const setResourcesPermissions = () => {
	// 	setState((prevState) => ({
	// 		...prevState,
	// 		permissions,
	// 		resources,
	// 	}));
	// };

	const toggleAddRoleModal = () => {
		setState((prevState) => ({
			...prevState,
			isAddEditModalOpen: !prevState.isAddEditModalOpen,
			isEditMode: false,
		}));
	};

	const toggleDeleteModal = () => {
		setState((prevState) => ({
			...prevState,
			isDeleteModalOpen: !prevState.isDeleteModalOpen,
		}));
	};

	const toggleEditRoleModal = (userRole) => () => {
		const selectedRole = roles.filter((role) => role._id === userRole) as any;

		const currentPermissions = selectedRole[0].resourceAccessLevels.reduce(
			(resourceAccessLevels, accessLevel) => {
				const formattedResource = {
					_id: accessLevel.resource._id,
					name: accessLevel.resource.name,
					permissionIds: accessLevel.permissions.map(
						(permission) => permission._id,
					),
				};

				return [...resourceAccessLevels, formattedResource];
			},
			[],
		);

		const currentResources = resources.map((resource) => {
			let newResource = resource;
			currentPermissions.forEach((res) => {
				if (res.name === resource.name) {
					newResource = res;
				}
			});
			return newResource;
		});

		setState((prevState) => ({
			...prevState,
			resources: currentResources,
			isEditMode: true,
			isAddEditModalOpen: !prevState.isAddEditModalOpen,
		}));
	};

	// const handleAddNewRole = () => {
	// 	const updatedResources = state.resources
	// 		.filter(
	// 			(resource) =>
	// 				resource.permissionIds !== undefined &&
	// 				resource.permissionIds.length !== 0,
	// 		)
	// 		.map((resource) => ({
	// 			resourceId: resource._id,
	// 			name: resource.name,
	// 			permissionIds: resource.permissionIds,
	// 		}));
	//
	// 	const userRole = {
	// 		title: formState.values.role_name,
	// 		description: formState.values.role_description,
	// 		resourceAccessLevels: updatedResources,
	// 	};
	//
	// 	if (updatedResources.length === 0) {
	// 		return dispatch(
	// 			displaySnackMessage('Please, check at least one permission'),
	// 		);
	// 	}
	//
	// 	dispatch(createUserRole(userRole));
	//
	// 	onResetPermission();
	// 	toggleAddRoleModal();
	// };

	const handleRoleUpdate = () => {
		const { _id, title, description } = roles.filter(
			(role) => role._id === state.roleId,
		) as any;

		const updatedResources = state.resources
			.filter((resource) => resource._id !== undefined)
			.map((resource) => ({
				resourceId: resource._id,
				name: resource.name,
				permissionIds: resource._id,
			}));

		if (!updatedResources.find((resource) => resource.permissionIds.length)) {
			return displaySnackMessage('Please, check at least one permission');
		}

		const roleUpdatePayload = {
			_id,
			title,
			description,
			resourceAccessLevels: updatedResources,
		};

		dispatch(editUserRole(roleUpdatePayload as unknown as UserRole));

		onResetPermission();
		toggleAddRoleModal();
	};

	const onResetAccessPermissions = () => {
		setState((prevState) => ({
			...prevState,
			resources: state.resources.map((resource) =>
				resource._id
					? {
							_id: resource._id,
							name: resource.name,
					  }
					: {
							...resource,
					  },
			),
		}));
	};

	const onResetPermission = () => onResetAccessPermissions();

	const handleRoleDelete = async () => {
		await dispatch(deleteUserRole(state.roleId));
		toggleDeleteModal();
	};

	const getResourcePermissions = (allResources) => {
		setState((prevState) => ({ ...prevState, resources: allResources }));
	};

	const renderModalContent = () => {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<CustomTextField
						label="Role name *"
						variant="outlined"
						size="small"
						name="roleName"
						fullWidth
						helperText={hasError('roleName') ? errors.roleName[0] : null}
						error={hasError('roleName')}
						onChange={handleFormChange}
						type="text"
						value={values.roleName || ''}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Mood fontSize="small" />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<CustomTextField
						label="Role description *"
						variant="outlined"
						size="small"
						name="roleDescription"
						fullWidth
						helperText={
							hasError('roleDescription') ? errors.roleDescription[0] : null
						}
						error={hasError('roleDescription')}
						onChange={handleFormChange}
						type="text"
						value={values.roleDescription || ''}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Grain fontSize="small" />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<PermissionAccess
					resources={state.resources}
					permissions={state.permissions}
					getResources={getResourcePermissions}
				/>
			</Grid>
		);
	};

	const renderAddEditRoleModal = () => {
		const { isEditMode, isAddEditModalOpen } = state;
		return (
			<Modal
				fullScreen={fullScreen}
				isModalOpen={isAddEditModalOpen}
				renderContent={renderModalContent()}
				onClose={toggleAddRoleModal}
				disabled={!isValid}
				renderHeader={isEditMode ? 'Edit user role' : 'Create a new role'}
				submitButtonName={isEditMode ? 'Update role' : 'Create role'}
				onSubmit={isEditMode ? handleRoleUpdate : handleSubmit}
				onDismiss={toggleAddRoleModal}
			/>
		);
	};

	const renderDeleteRoleModal = () => {
		const { isDeleteModalOpen } = state;
		const selectedRole = roles.filter(
			(role) => role._id === state.roleId,
		) as any;

		const userCount = selectedRole[0]?.userCount;
		return (
			<Modal
				isModalOpen={isDeleteModalOpen}
				renderDialogText={`Permanently delete role: ${selectedRole[0]?.title}`}
				renderContent={
					<Typography variant="body2" color="primary">
						{selectedRole && userCount > 0
							? `You cannot delete this role as it is assigned to ${userCount} user${
									userCount > 1 ? 's' : ''
							  }`
							: 'This cannot be undone'}
					</Typography>
				}
				onClose={toggleDeleteModal}
				renderHeader="Delete Role"
				submitButtonName="Delete role"
				onSubmit={handleRoleDelete}
				onDismiss={toggleDeleteModal}
				disabled={selectedRole && userCount > 0}
			/>
		);
	};

	const renderActionButtons = (role: string): JSX.Element => {
		const handleDelete = () =>
			setState((prevState) => ({
				...prevState,
				roleId: role,
				isDeleteModalOpen: !prevState.isDeleteModalOpen,
			}));

		return (
			<div className={classes.root} key={role}>
				<Stack direction="row" spacing={1}>
					<Typography
						style={{ cursor: 'pointer', paddingRight: 12 }}
						id={role}
						variant="body2"
						color="primary"
						onClick={toggleEditRoleModal(role)}
						onKeyDown={toggleEditRoleModal(role)}
					>
						Edit
					</Typography>
					<Typography
						style={{ cursor: 'pointer', color: red[900] }}
						id={role}
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
				field: 'title',
				headerName: 'Role',
				flex: 0.1,
				headerClassName: 'table-header',
			},
			{
				field: 'id',
				headerName: 'Role ID',
				flex: 0.2,
				headerClassName: 'table-header',
			},
			{
				field: 'description',
				headerName: 'Description',
				flex: 0.4,
				headerClassName: 'table-header',
			},
			{
				field: 'users',
				headerName: 'Users',
				flex: 0.1,
				headerClassName: 'table-header',
				cellClassName: 'table-cell',
				renderCell: ({ value }: GridCellParams) => (
					<Chip color="primary" label={value as string} />
				),
			},
			{
				field: 'actions',
				headerName: 'Actions',
				flex: 0.2,
				headerClassName: 'table-header',
				renderCell: ({ value }: GridCellParams) =>
					renderActionButtons(value as string),
			},
		];

		const rows = roles.map((role) => ({
			id: role._id,
			title: role.title,
			description: role.description,
			users: role.userCount,
			actions: role._id,
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
									field: 'title',
									sort: 'asc' as GridSortDirection,
								},
							]}
						/>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="user-roles-page">
			<Grid container item xs={12}>
				<Grid
					item
					container
					direction="column"
					justifyContent="flex-start"
					alignItems="stretch"
					spacing={1}
					xs
					style={{ margin: 0, padding: 0 }}
				>
					<DashboardCard
						heading="User Roles"
						body={renderTableContent()}
						actionItem={
							// <Restrict authorize={['roles:add']}>
							<Button
								color="primary"
								size="small"
								variant="outlined"
								onClick={toggleAddRoleModal}
							>
								<Add fontSize="small" />
								Add role
							</Button>
							// </Restrict>
						}
					/>
					{renderAddEditRoleModal()}
					{renderDeleteRoleModal()}
				</Grid>
			</Grid>
		</div>
	);
};

export default UserRolesPage;
