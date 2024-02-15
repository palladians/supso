<script lang="ts">
	import Head from '$lib/components/head.svelte';
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import Highlight from 'svelte-highlight';
	import json from 'svelte-highlight/languages/json';
	import githubDark from 'svelte-highlight/styles/github-dark';
	import EventContentEditor from '$lib/components/dashboard/event-content-editor.svelte';
	import { KanbanSquareIcon, CalendarIcon, CheckIcon } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import Combobox from '$lib/components/dashboard/combobox.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { Calendar } from '$lib/components/ui/calendar';
	import { derived, writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { CalendarDate } from '@internationalized/date';

	export let data;

	export const context = JSON.stringify(data.event.context, null, 4);
	export const assigneeId = writable<string | null>(data.event.assigneeId);
	export const dueDate = writable<string | null>(data.event.dueDate);
	export const dueDateParsed = derived(dueDate, ($dueDate) => {
		if (!$dueDate) return;
		const date = new Date(parseInt($dueDate ?? ''));
		return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
	});
	export const content = writable<string>(data.event.content ?? '');

	onMount(() => {
		const unsubAssignee = assigneeId.subscribe(async (newAssigneeId) => {
			if (!newAssigneeId) return;
			const formData = new FormData();
			formData.set('assigneeId', newAssigneeId ?? '');
			await fetch('?/setAssignee', { body: formData, method: 'POST' });
		});
		const unsubDueDate = dueDate.subscribe(async (newDueDate) => {
			if (!newDueDate) return;
			const formData = new FormData();
			formData.set('dueDate', newDueDate ?? '');
			await fetch('?/setDueDate', { body: formData, method: 'POST' });
		});
		const unsubContent = content.subscribe(async (newContent) => {
			if (newContent.length === 0) return;
			const formData = new FormData();
			formData.set('content', newContent);
			await fetch('?/updateContent', { body: formData, method: 'POST' });
		});
		return () => {
			unsubAssignee();
			unsubDueDate();
			unsubContent();
		};
	});
</script>

<svelte:head>
	{@html githubDark}
</svelte:head>

<Head title={`${data.event.event} in #${data.event.channel}`} />

<div class="container flex flex-col">
	<PageNavbar
		title={data.event.event}
		subpage={{ name: 'Events', url: `/projects/${data.project.id}/events` }}
	>
		<div class="flex items-center" slot="addon">
			{#if data.event.resolved === 'true'}
				<form action="?/undoResolved" method="POST">
					<Button type="submit" variant="secondary" size="sm" class="gap-1">
						<CheckIcon size={16} />
						<span>Resolved</span>
					</Button>
				</form>
			{:else}
				<form action="?/setResolved" method="POST">
					<Button type="submit" size="sm" class="gap-1">
						<CheckIcon size={16} />
						<span>Resolve</span>
					</Button>
				</form>
			{/if}
		</div>
	</PageNavbar>
	<Tabs.Root value="details">
		<Tabs.List class="grid w-full max-w-[32rem] grid-cols-2">
			<Tabs.Trigger value="details">Details</Tabs.Trigger>
			<Tabs.Trigger value="context">Context</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="details">
			<Card.Root class="flex flex-1 flex-col">
				<Card.Header>
					<Card.Title>Details</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-8 px-0">
					<div class="flex flex-col gap-4">
						<Table.Root>
							<Table.Body>
								<Table.Row>
									<Table.Head>ID</Table.Head>
									<Table.Cell>{data.event.id}</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head>Channel</Table.Head>
									<Table.Cell
										><a
											href={`/projects/${data.event.projectId}/events?channel=${data.event.channel}`}
											>#{data.event.channel}</a
										></Table.Cell
									>
								</Table.Row>
								<Table.Row>
									<Table.Head>Notify</Table.Head>
									<Table.Cell>
										<Badge variant="secondary">
											{data.event.notify}
										</Badge>
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head>Boards</Table.Head>
									<Table.Cell>
										<div class="flex gap-2">
											{#each data.boards as board}
												<Button
													href={`/boards/${board.id}`}
													size="sm"
													variant="outline"
													class="gap-2"
												>
													<KanbanSquareIcon size={16} />
													<span>{board.name}</span>
												</Button>
											{/each}
										</div>
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head>Assignee</Table.Head>
									<Table.Cell>
										<Combobox
											placeholder="Assignee"
											options={data.projectMembers}
											value={assigneeId}
										/>
									</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Head>Due Date</Table.Head>
									<Table.Cell>
										<Popover.Root>
											<Popover.Trigger asChild let:builder>
												<Button
													variant="outline"
													class={cn(
														'w-[240px] justify-start gap-2 text-left font-normal',
														!$dueDateParsed && 'text-muted-foreground'
													)}
													builders={[builder]}
												>
													<CalendarIcon size={16} />
													<span>{$dueDateParsed ? $dueDateParsed.toString() : 'Pick a date'}</span>
												</Button>
											</Popover.Trigger>
											<Popover.Content class="w-auto p-0" align="start">
												<Calendar
													value={$dueDateParsed}
													onValueChange={(newDueDate) => {
														const timestamp = newDueDate
															? newDueDate.toDate('UTC').getTime().toString()
															: null;
														dueDate.set(timestamp);
													}}
												/>
											</Popover.Content>
										</Popover.Root>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</div>
					<Separator class="col-span-2" />
					<h2 class="ml-6 font-semibold">Tags</h2>
					<form action="?/updateTags" method="POST" class="flex flex-col gap-4">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Tag</Table.Head>
									<Table.Head>Value</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each Object.entries(data.event.tags ?? {}) as [tag, value]}
									<Table.Row>
										<Table.Cell>{tag}</Table.Cell>
										<Table.Cell>
											<input type="hidden" name="tag.key" value={tag} />
											<Input name="tag.value" {value} />
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
						<div class="mr-4 flex gap-2 self-end">
							<Button type="submit" size="sm" variant="secondary">Add Tag</Button>
							<Button type="submit" size="sm">Save Tags</Button>
						</div>
					</form>
					<Separator class="col-span-2" />
					<h2 class="ml-6 font-semibold">Content</h2>
					<div class="mx-6">
						<EventContentEditor value={$content} onBlur={(value) => content.set(value)} />
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="context">
			<Card.Root class="flex flex-1 flex-col">
				<Card.Header>
					<Card.Title>Context</Card.Title>
				</Card.Header>
				<Card.Content>
					<Highlight language={json} code={context} class="w-full max-w-[64rem]" />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
