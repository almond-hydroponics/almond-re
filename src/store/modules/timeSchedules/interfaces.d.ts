// types
import {
  ADD_SCHEDULES_FAILURE,
  ADD_SCHEDULES_REQUEST,
  ADD_SCHEDULES_SUCCESS,
  DELETE_SCHEDULE_FAILURE,
  DELETE_SCHEDULE_REQUEST,
  DELETE_SCHEDULE_SUCCESS,
  EDIT_SCHEDULE_FAILURE,
  EDIT_SCHEDULE_REQUEST,
  EDIT_SCHEDULE_SUCCESS,
  GET_PUMP_STATUS_FAILURE,
  GET_PUMP_STATUS_REQUEST,
  GET_PUMP_STATUS_SUCCESS,
  GET_SCHEDULE_REQUEST,
  GET_SCHEDULE_SUCCESS,
  GET_SCHEDULES_FAILURE,
  TOGGLE_PUMP_STATUS_FAILURE,
  TOGGLE_PUMP_STATUS_REQUEST,
  TOGGLE_PUMP_STATUS_SUCCESS,
} from './types';

export interface GetAllSchedulesActionRequest {
  type: GET_SCHEDULE_REQUEST;
  isLoading: boolean;
}

export interface GetAllSchedulesActionSuccess {
  schedules: Schedule[];
  type: GET_SCHEDULE_SUCCESS;
  isLoading: boolean;
}

export interface GetAllSchedulesActionFailure {
  type: GET_SCHEDULES_FAILURE;
  errors: any;
  isLoading: boolean;
}

export interface AddScheduleActionRequest {
  type: ADD_SCHEDULES_REQUEST;
  isLoading: boolean;
}

export interface AddScheduleActionSuccess {
  schedule: NewSchedule;
  type: ADD_SCHEDULES_SUCCESS;
  isLoading: boolean;
}

export interface AddSchedulesActionFailure {
  type: ADD_SCHEDULES_FAILURE;
  errors: any;
}

export interface DeleteScheduleActionRequest {
  type: DELETE_SCHEDULE_REQUEST;
  isLoading: boolean;
}

export interface DeleteScheduleActionSuccess {
  id: string;
  type: DELETE_SCHEDULE_SUCCESS;
  isLoading: boolean;
}

export interface DeleteScheduleActionFailure {
  type: DELETE_SCHEDULE_FAILURE;
  errors: any;
}

export interface EditScheduleActionRequest {
  type: EDIT_SCHEDULE_REQUEST;
  isLoading: boolean;
}

export interface EditScheduleActionSuccess {
  id: string;
  schedule: NewSchedule;
  type: EDIT_SCHEDULE_SUCCESS;
  isLoading: boolean;
}

export interface EditScheduleActionFailure {
  type: EDIT_SCHEDULE_FAILURE;
  errors: any;
}

export interface TogglePumpStatusActionRequest {
  type: TOGGLE_PUMP_STATUS_REQUEST;
}

export interface TogglePumpStatusActionSuccess {
  id: string;
  enabled: Status;
  type: TOGGLE_PUMP_STATUS_SUCCESS;
}

export interface TogglePumpStatusActionFailure {
  type: TOGGLE_PUMP_STATUS_FAILURE;
  errors: any;
}

export interface GetPumpStatusActionRequest {
  type: GET_PUMP_STATUS_REQUEST;
}

export interface GetPumpStatusActionSuccess {
  enabled: Status;
  type: GET_PUMP_STATUS_SUCCESS;
}

export interface GetPumpStatusActionFailure {
  type: GET_PUMP_STATUS_FAILURE;
  errors: any;
}

export interface Schedule {
  id?: string;
  _id?: string;
  schedule: string;
  enabled?: boolean;
}

export interface Status {
  enabled: boolean;
}

export interface NewSchedule {
  schedule: string;
}
