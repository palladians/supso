<script lang="ts">
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { PlusIcon } from 'lucide-svelte';
	import { KanbanSquareIcon } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<div class="container flex flex-col">
	<PageNavbar title="Boards" length={data.boards.length}>
		<Button
			href={`/projects/${$page.params.projectId}/boards/create`}
			variant="secondary"
			class="gap-1"
			slot="addon"
		>
			<PlusIcon size={16} />
			Create Board
		</Button>
	</PageNavbar>
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
		<a href={`/projects/${$page.params.projectId}/boards/create`} class="flex flex-1">
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
