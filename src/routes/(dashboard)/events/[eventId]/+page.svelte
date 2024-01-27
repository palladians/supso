<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import githubDark from 'svelte-highlight/styles/github-dark';

	export let data;

	export const tags = JSON.stringify(data.event.tags, null, 4);
	export const context = JSON.stringify(data.event.context, null, 4);
</script>

<svelte:head>
	{@html githubDark}
</svelte:head>

<Card.Root class="flex gap-4 p-6">
	<div class="flex flex-[2] flex-col gap-8">
		<div class="flex gap-2 text-sm">
			<a class="text-muted-foreground" href="/projects">Projects</a>
			<span class="text-muted">/</span>
			<a class="text-muted-foreground" href={`/projects/${data.event.project.id}`}
				>{data.event.project.name}</a
			>
			<span class="text-muted">/</span>
			<a class="text-muted-foreground" href={`/projects/${data.event.project.id}/events`}>Events</a>
		</div>
		<div class="grid grid-cols-[1fr_3fr] items-center justify-center gap-6">
			<p class="text-muted-foreground">ID</p>
			<p>{data.event.id}</p>
			<p class="text-muted-foreground">Event</p>
			<div>
				<Badge variant="secondary">{data.event.event}</Badge>
			</div>
			<p class="text-muted-foreground">Channel</p>
			<div>
				<Badge variant="secondary">#{data.event.channel}</Badge>
			</div>
			<p class="text-muted-foreground">Notified</p>
			<div>
				<Badge variant="secondary">{data.event.notify}</Badge>
			</div>
			<p class="text-muted-foreground">Tags</p>
			<Highlight language={json} code={tags} />
		</div>
	</div>
	<div class="flex-1">
		<Card.Root>
			<Card.Header>
				<Card.Title>Context</Card.Title>
			</Card.Header>
			<Card.Content>
				<Highlight language={json} code={context} />
			</Card.Content>
		</Card.Root>
	</div>
</Card.Root>
