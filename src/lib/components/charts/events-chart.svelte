<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { BarChartSimple, ChartTheme, ScaleTypes } from '@carbon/charts-svelte';

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
			bottom: { mapsTo: 'date', scaleType: ScaleTypes.LABELS }
		},
		color: {
			pairing: {
				option: 4
			},
			scale: {
				Qty: '#14b8a6',
				Misc: '#14b8a6'
			}
		}
	}}
/>
