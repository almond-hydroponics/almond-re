import { useContext, lazy, useEffect, useState } from 'react';
import dayjs from '@utils/dayjsTime';
import { getDiff } from '@utils/validateTimeOneHour';
// components
import { Cell, Row } from '@material/react-layout-grid';
import {
	BlurLinearTwoTone,
	BlurOn,
	MemoryTwoTone,
	OpacityTwoTone,
	ScheduleTwoTone,
	BubbleChart,
} from '@material-ui/icons';
import { ComponentContext } from '@context/ComponentContext';
import { UserContext } from '@context/UserContext';
import formatWaterLevelData from '@utils/formatWaterLevel';
import { RegularUserAnalyticsProps } from '@pages/AnalyticsPage/interfaces';
import { useSubscription } from '@hooks/mqtt';
import { getSensorData } from '@modules/sensorData';
import { useDispatch } from 'react-redux';

const AnalyticsCard = lazy(() => import('@components/AnalyticsCard'));

const RegularUserAnalytics = ({
	sensorData,
	getAllSchedules,
	timeSchedules,
}: RegularUserAnalyticsProps): JSX.Element => {
	const menu = useContext(ComponentContext);
	const { setSelectedIndex } = menu;
	const { temperature, humidity, waterLevel } = sensorData;

	const handleCardClick = (index: number) => () => setSelectedIndex(index);
	const [nextTimeSchedule, setNextTimeSchedule] = useState('00:00');
	const { activeDevice } = useContext(UserContext);
	useEffect(() => {
		const getSchedule = async () => getAllSchedules(activeDevice._id);
		getSchedule().then(() => {
			if (timeSchedules.length > 0) {
				const nextTime = timeSchedules
					.filter((t) => {
						const diff = getDiff(dayjs(), t.schedule);
						return diff > 0;
					})
					.reduce((accumulator, current) => {
						const accumulatorDiff = getDiff(dayjs(), accumulator.schedule);
						const currentDiff = getDiff(dayjs(), current.schedule);
						return accumulatorDiff < currentDiff ? accumulator : current;
					});
				setNextTimeSchedule(nextTime.schedule);
			}
		});
	});

	return (
		<>
			<Row className="analytics-page" data-testid="regular-analytics-page">
				<Cell columns={4} desktopColumns={4} tabletColumns={4} phoneColumns={4}>
					<AnalyticsCard
						onClick={handleCardClick(1)}
						colorClass="card-color-blue"
						icon={<OpacityTwoTone className="content-icon" />}
						mainInfo="Water Level"
						subInfo={`${formatWaterLevelData(waterLevel)} %`}
					/>
				</Cell>
				<Cell columns={4} desktopColumns={4} tabletColumns={4} phoneColumns={4}>
					<AnalyticsCard
						onClick={handleCardClick(1)}
						colorClass="card-color-yellow"
						icon={<BlurLinearTwoTone className="content-icon" />}
						mainInfo="Water Temperature"
						subInfo={`${temperature ?? 0} \u00b0C`}
					/>
				</Cell>
				<Cell columns={4} desktopColumns={4} tabletColumns={4} phoneColumns={4}>
					<AnalyticsCard
						onClick={handleCardClick(1)}
						colorClass="card-color-brown"
						icon={<ScheduleTwoTone className="content-icon" />}
						mainInfo="Next schedule"
						subInfo={`${nextTimeSchedule} `}
					/>
				</Cell>
			</Row>
			<Row className="analytics-page">
				<Cell columns={4} desktopColumns={4} tabletColumns={4} phoneColumns={4}>
					<AnalyticsCard
						onClick={handleCardClick(2)}
						colorClass="card-color-red"
						icon={<BlurOn className="content-icon" />}
						mainInfo="Air Temperature"
						subInfo={`${temperature ?? 0} \u00b0C`}
					/>
				</Cell>
				<Cell columns={4} desktopColumns={4} tabletColumns={4} phoneColumns={4}>
					<AnalyticsCard
						onClick={handleCardClick(2)}
						colorClass="card-color-green"
						icon={<BubbleChart className="content-icon" />}
						mainInfo="Air Humidity"
						subInfo={`${humidity ?? 0} %`}
					/>
				</Cell>
				<Cell columns={4} desktopColumns={4} tabletColumns={4} phoneColumns={4}>
					<AnalyticsCard
						onClick={handleCardClick(3)}
						colorClass="card-color-purple"
						icon={<MemoryTwoTone className="content-icon" />}
						mainInfo="Power usage"
						subInfo="30 KW"
					/>
				</Cell>
			</Row>
		</>
	);
};

export default RegularUserAnalytics;
