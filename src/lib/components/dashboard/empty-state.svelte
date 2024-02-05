<script lang="ts">
	import { Button } from '../ui/button';

	export let title: string;
	export let description: string;
	export let buttonLabel: string;
	export let buttonHref: string;
</script>

<div class="flex flex-col items-center justify-center gap-6 py-16">
	<h2 class="text-xl font-semibold">{title}</h2>
	<p>{description}</p>
	<Button href={buttonHref}>{buttonLabel}</Button>
</div>
