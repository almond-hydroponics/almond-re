import { Doughnut } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import { DonutDisplayProps } from '@components/organisms/DonutDisplay/interfaces';
import { Grid } from '@material-ui/core';

// some of this code is a variation on https://jsfiddle.net/cmyker/u6rr5moq/
const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
	draw() {
		originalDoughnutDraw.apply(this, arguments);

		const { chart } = this.chart;
		const { ctx } = chart;
		const { width } = chart;
		const { height } = chart;

		const fontSize = (height / 80).toFixed(2);
		ctx.font = `${fontSize}em Google Sans,Roboto,Helvetica Neue,sans-serif`;
		ctx.textBaseline = 'middle';

		const centerConfig = chart.config.options.elements.center;
		const { text } = centerConfig;
		const color = centerConfig.color || '#343434';
		const textYHeight = centerConfig.textYHeight || 2;

		const textX = Math.round((width - ctx.measureText(text).width) / 2);
		const textY = height / textYHeight;

		ctx.fillStyle = color;
		ctx.fillText(text, textX, textY);
	},
});

const DonutDisplay = ({
	backgroundColor,
	hoverBackgroundColor,
	data,
	donutInfo,
	halfDonut,
}: DonutDisplayProps): JSX.Element => {
	const donutDetails = {
		datasets: [
			{
				data,
				backgroundColor,
				hoverBackgroundColor,
				labelFontColor: backgroundColor[0],
			},
		],
		options: {
			elements: {
				center: {
					text: donutInfo,
					color: '#4e4e4e', // Default is #000000
					textYHeight: halfDonut ? 1.2 : 2,
				},
			},
			legend: {
				display: false,
			},
			tooltips: {
				enabled: false,
				intersect: true,
			},
			rotation: halfDonut ? Math.PI : -0.5 * Math.PI,
			circumference: halfDonut ? Math.PI : 2 * Math.PI,
			segmentShowStroke: true,
			segmentStrokeColor: '#fff',
			segmentStrokeWidth: 2,
			percentageInnerCutout: 50,
			animationSteps: 100,
			animationEasing: 'easeOutBounce',
			animateRotate: true,
			animateScale: false,
			responsive: true,
			showScale: true,
			maintainAspectRatio: false,
		},
	};

	return (
		<Grid item xs={12}>
			<Doughnut
				data={donutDetails}
				// @ts-ignore
				options={donutDetails.options}
				width={250}
				height={250}
			/>
		</Grid>
	);
};

export default DonutDisplay;