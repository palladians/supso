<script lang="ts">
	import Breadcrumbs from './breadcrumbs.svelte';
	export let title: string;
	export let length: number | undefined = 0;
	export let subpage: { name: string; url: string } | undefined;
</script>

<div class="bg-background sticky top-0 z-10 flex items-center justify-between py-4">
	<div class="sticky top-0 flex flex-col gap-1">
		<Breadcrumbs {subpage} />
		<h2 class="flex items-center gap-1 text-lg font-semibold">
			<span>{title}</span>
			{#if length}
				<span class="text-sm">({length})</span>
			{/if}
		</h2>
	</div>
	<slot name="addon" />
</div>
