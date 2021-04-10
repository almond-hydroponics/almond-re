import { UserDetails } from '@modules/user/interfaces';

import {
	GET_ALL_PEOPLE_FAILURE,
	GET_ALL_PEOPLE_REQUEST,
	GET_ALL_PEOPLE_SUCCESS,
	UPDATE_PERSON_DETAILS_FAILURE,
	UPDATE_PERSON_DETAILS_SUCCESS,
} from './types';

export interface GetAllPeopleActionRequest {
	type: GET_ALL_PEOPLE_REQUEST;
	isLoading: boolean;
}

export interface GetAllPeopleActionSuccess {
	people: UserDetails[];
	type: GET_ALL_PEOPLE_SUCCESS;
	isLoading: boolean;
}

export interface GetAllPeopleActionFailure {
	type: GET_ALL_PEOPLE_FAILURE;
	errors: null;
	isLoading: boolean;
}

export interface UpdatePersonSuccess {
	person: UserDetails;
	type: UPDATE_PERSON_DETAILS_SUCCESS;
	isLoading: boolean;
}

export interface UpdatePersonFailure {
	type: UPDATE_PERSON_DETAILS_FAILURE;
	errors: null;
	isLoading: boolean;
}
