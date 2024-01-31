<script lang="ts">
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import githubDark from 'svelte-highlight/styles/github-dark';

	export let data;

	export const context = JSON.stringify(data.event.context, null, 4);
</script>

<svelte:head>
	{@html githubDark}
</svelte:head>

<div class="container flex flex-col">
	<PageNavbar
		title={data.event.event}
		subpage={{ name: 'Events', url: `/projects/${data.project.id}/events` }}
	/>
	<Card.Root class="flex flex-1 gap-4 p-6">
		<div class="grid flex-1 grid-cols-[1fr_3fr] justify-center gap-12">
			<h2 class="font-semibold">Details</h2>
			<div class="flex flex-col gap-4">
				<Table.Root>
					<Table.Body>
						<Table.Row>
							<Table.Head>ID</Table.Head>
							<Table.Cell>{data.event.id}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Channel</Table.Head>
							<Table.Cell>#{data.event.channel}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Notify</Table.Head>
							<Table.Cell>
								<Badge variant="secondary">
									{data.event.notify}
								</Badge>
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</div>
			<Separator class="col-span-2" />
			<h2 class="font-semibold">Tags</h2>
			<div class="flex flex-col gap-4">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Tag</Table.Head>
							<Table.Head>Value</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each Object.entries(data.event.tags) as [tag, value]}
							<Table.Row>
								<Table.Cell>{tag}</Table.Cell>
								<Table.Cell>{value}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
			<Separator class="col-span-2" />
			<h2 class="font-semibold">Context</h2>
			<Card.Root class="overflow-hidden">
				<Highlight language={json} code={context} />
			</Card.Root>
		</div>
	</Card.Root>
</div>
