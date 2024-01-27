<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { PlusIcon } from 'lucide-svelte';
	import { KanbanSquareIcon } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-between">
		<h2 class="text-lg font-semibold">Boards</h2>
		<Button
			href={`/projects/${$page.params.projectId}/boards/create`}
			variant="secondary"
			class="gap-1"
		>
			<PlusIcon size={16} />
			Create Board
		</Button>
	</div>
	<div class="grid grid-cols-4 gap-8">
		{#each data.boards as board}
			<a href={`/boards/${board.id}`}>
				<Card.Root>
					<Card.Header class="items-start gap-2">
						<Card.Title>{board.name}</Card.Title>
						<Badge variant="secondary">{board.tag}</Badge>
					</Card.Header>
				</Card.Root>
			</a>
		{/each}
		<a href={`/projects/${$currentProjectId}/boards/create`} class="flex flex-1">
			<Card.Root class="flex-1">
				<Card.Header class="flex flex-1 justify-center">
					<div class="mt-2 flex flex-1 items-center gap-2 pt-1">
						<KanbanSquareIcon />
						<Card.Title>Create</Card.Title>
					</div>
				</Card.Header>
			</Card.Root>
		</a>
	</div>
</div>
