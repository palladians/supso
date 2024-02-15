<script lang="ts">
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { PlusIcon } from 'lucide-svelte';
	import { ChevronRightIcon, KanbanSquareIcon } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<div class="container flex flex-1 flex-col">
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
	<Card.Root class="flex flex-1 flex-col overflow-hidden">
		{#if data.boards.length === 0}
			<div class="flex w-full flex-1 flex-col items-center justify-center p-4">
				<h2>No boards</h2>
			</div>
		{/if}
		{#each data.boards as board}
			<Button
				variant="ghost"
				href={`/boards/${board.id}`}
				class="items-center justify-between rounded-none border-b p-8"
			>
				<div class="flex items-center gap-2">
					<KanbanSquareIcon size={20} />
					<span>{board.name}</span>
					<Badge variant="secondary">{board.tag}</Badge>
				</div>
				<ChevronRightIcon size={16} />
			</Button>
		{/each}
	</Card.Root>
</div>
