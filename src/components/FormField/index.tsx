import React, { useState, useEffect } from 'react';

// interfaces
import {
	FormFieldProps,
	FormFieldState,
} from '@components/FormField/interfaces';

// components
import { InputAdornment, TextField } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const ValidationTextField = withStyles({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		marginBottom: '12px',
		'& input:valid + fieldset': {
			// borderColor: '#1967D2',
			borderWidth: 1,
		},
		'& input:invalid + fieldset': {
			borderColor: '#f44336',
			borderWidth: 2,
		},
		'& input:valid:focus + fieldset': {
			borderColor: '#1967D2',
			borderLeftWidth: 6,
			padding: '4px !important', // override inline-style
		},
	},
})(TextField);

const FormField = (props: FormFieldProps): JSX.Element => {
	const [state, setState] = useState<FormFieldState>({
		dirty: false,
		errors: [],
		value: '',
		name: '',
	});

	const {
		id,
		required,
		labelText,
		leadingIcon,
		validator = (f) => f,
		onStateChanged = (f) => f,
		// type,
		// label,
		// onLeadingIconSelect,
		// trailingIcon,
		// placeholder,
		// children,
	} = props;

	useEffect(() => {
		onStateChanged(state);
	}, [state]);

	const hasChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();

		const { value } = e.target;
		const isEmpty = value.length === 0;
		const requiredMissing = state.dirty && required && isEmpty;

		let errors: string[] = [];

		if (requiredMissing) {
			errors = [...errors, `${labelText} is required`];
		} else if (typeof validator === 'function') {
			try {
				validator(value);
			} catch (e) {
				errors = [...errors, e.message];
			}
		}

		setState((prevState) => ({
			...prevState,
			value,
			errors,
			name: id || '',
			dirty: !prevState.dirty || false,
		}));
	};

	const { value, errors } = state;
	const hasErrors = errors.length > 0;

	return (
		<ValidationTextField
			id={id}
			className="mdc-text-field--fullwidth"
			variant="outlined"
			label={labelText}
			fullWidth
			size="small"
			value={value || props.value}
			onChange={hasChanged}
			error={hasErrors && !!errors[0]}
			helperText={errors[0]}
			InputLabelProps={{
				shrink: true,
			}}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">{leadingIcon}</InputAdornment>
				),
			}}
		/>
	);
};

export default FormField;
