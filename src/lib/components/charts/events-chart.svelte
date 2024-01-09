<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { BarChartSimple, ChartTheme } from '@carbon/charts-svelte';

	export let data;
</script>

<BarChartSimple
	{data}
	options={{
		theme: ChartTheme.G100,
		height: '400px',
		grid: {
			x: {
				enabled: false
			},
			y: {
				enabled: false
			}
		},
		legend: {
			enabled: false
		},
		axes: {
			left: { mapsTo: 'events' },
			bottom: { mapsTo: 'date', scaleType: 'labels' }
		},
		color: {
			pairing: {
				option: 2
			},
			scale: {
				Qty: '#925699',
				Misc: '#525669'
			}
		}
	}}
/>
