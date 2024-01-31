<script lang="ts">
	import { page } from '$app/stores';

	export let subpage: { name: string; url: string } | undefined;
</script>

<div class="text-muted-foreground flex gap-2 text-sm">
	<a href="/projects">Projects</a>
	<p class="text-muted">/</p>
	<a href={`/projects/${$page.data.project.id}`}>{$page.data.project.name}</a>
	{#if subpage}
		<p class="text-muted">/</p>
		<a href={subpage.url}>{subpage.name}</a>
	{/if}
</div>
