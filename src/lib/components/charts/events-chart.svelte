<script lang="ts">
	import { Bar } from 'svelte-chartjs';

	import {
		Chart,
		Title,
		Tooltip,
		BarElement,
		CategoryScale,
		LinearScale,
		type ChartData
	} from 'chart.js';

	Chart.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

	export let data: ChartData<'bar', (number | [number, number])[], unknown>;
</script>

<Bar {data} options={{ responsive: true }} />
