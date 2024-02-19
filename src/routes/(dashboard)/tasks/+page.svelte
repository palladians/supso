<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { CheckIcon } from 'lucide-svelte';
	import { formatDate } from '$lib/format/date';

	export let data;
</script>

<div class="container flex flex-1 flex-col">
	<h2 class="py-4 text-lg font-semibold">Tasks</h2>
	<Card.Root class="flex w-full flex-col">
		<Card.Header>
			<Card.Title>Events assigned as tasks</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			{#if data.events.length === 0}
				<p>No tasks assigned.</p>
			{/if}
			{#each data.events as event}
				<Card.Root class="class flex items-center justify-between p-2">
					<div class="flex gap-2">
						<Badge href={`/projects/${event.projectId}`} variant="secondary"
							>{event.project.name}</Badge
						>
						{#if event.dueDate}
							<Badge variant="outline">Due to: {formatDate(event.dueDate)}</Badge>
						{/if}
						<div>
							<a href={`/events/${event.id}`}>{event.event}</a> in
							<a href={`/projects/${event.projectId}/events?channel=${event.channel}`}
								>#{event.channel}</a
							>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<Button href={`/events/${event.id}`} variant="outline" size="sm">Details</Button>
						<form action="?/resolveTask" method="POST">
							<input type="hidden" name="taskId" value={event.id} />
							<Button type="submit" variant="secondary" size="sm" class="gap-1">
								<CheckIcon size={16} />
								<span>Resolve</span>
							</Button>
						</form>
					</div>
				</Card.Root>
			{/each}
		</Card.Content>
	</Card.Root>
</div>
