import { ChartDataTrend, SensorData } from '@modules/sensorData/interfaces';

export interface State {
	sensorData: SensorData;
	airTemperatureTrend: ChartDataTrend[];
	waterTemperatureTrend: ChartDataTrend[];
	plantHumidityTrend: ChartDataTrend[];
	isLoading: boolean;
	errors: null;
}

export const GET_SENSOR_DATA_REQUEST = 'almond/sensor/GET_SENSOR_DATA_REQUEST';
export type GET_SENSOR_DATA_REQUEST = typeof GET_SENSOR_DATA_REQUEST;

export const GET_SENSOR_DATA_SUCCESS = 'almond/sensor/GET_SENSOR_DATA_SUCCESS';
export type GET_SENSOR_DATA_SUCCESS = typeof GET_SENSOR_DATA_SUCCESS;

export const GET_SENSOR_DATA_FAILURE = 'almond/sensor/GET_SENSOR_DATA_FAILURE';
export type GET_SENSOR_DATA_FAILURE = typeof GET_SENSOR_DATA_FAILURE;

export const GET_AIR_TEMPERATURE_TREND_REQUEST =
	'almond/sensor/GET_AIR_TEMPERATURE_TREND_REQUEST';
export type GET_AIR_TEMPERATURE_TREND_REQUEST =
	typeof GET_AIR_TEMPERATURE_TREND_REQUEST;

export const GET_AIR_TEMPERATURE_TREND_SUCCESS =
	'almond/sensor/GET_AIR_TEMPERATURE_TREND_SUCCESS';
export type GET_AIR_TEMPERATURE_TREND_SUCCESS =
	typeof GET_AIR_TEMPERATURE_TREND_SUCCESS;

export const GET_AIR_TEMPERATURE_TREND_FAILURE =
	'almond/sensor/GET_AIR_TEMPERATURE_TREND_FAILURE';
export type GET_AIR_TEMPERATURE_TREND_FAILURE =
	typeof GET_AIR_TEMPERATURE_TREND_FAILURE;

export const GET_WATER_TEMPERATURE_TREND_REQUEST =
	'almond/sensor/GET_WATER_TEMPERATURE_TREND_REQUEST';
export type GET_WATER_TEMPERATURE_TREND_REQUEST =
	typeof GET_WATER_TEMPERATURE_TREND_REQUEST;

export const GET_WATER_TEMPERATURE_TREND_SUCCESS =
	'almond/sensor/GET_WATER_TEMPERATURE_TREND_SUCCESS';
export type GET_WATER_TEMPERATURE_TREND_SUCCESS =
	typeof GET_WATER_TEMPERATURE_TREND_SUCCESS;

export const GET_WATER_TEMPERATURE_TREND_FAILURE =
	'almond/sensor/GET_WATER_TEMPERATURE_TREND_FAILURE';
export type GET_WATER_TEMPERATURE_TREND_FAILURE =
	typeof GET_WATER_TEMPERATURE_TREND_FAILURE;

export const GET_PLANT_HUMIDITY_TREND_REQUEST =
	'almond/sensor/GET_PLANT_HUMIDITY_TREND_REQUEST';
export type GET_PLANT_HUMIDITY_TREND_REQUEST =
	typeof GET_PLANT_HUMIDITY_TREND_REQUEST;

export const GET_PLANT_HUMIDITY_TREND_SUCCESS =
	'almond/sensor/GET_PLANT_HUMIDITY_TREND_SUCCESS';
export type GET_PLANT_HUMIDITY_TREND_SUCCESS =
	typeof GET_PLANT_HUMIDITY_TREND_SUCCESS;

export const GET_PLANT_HUMIDITY_TREND_FAILURE =
	'almond/sensor/GET_PLANT_HUMIDITY_TREND_FAILURE';
export type GET_PLANT_HUMIDITY_TREND_FAILURE =
	typeof GET_PLANT_HUMIDITY_TREND_FAILURE;
