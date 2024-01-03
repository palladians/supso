<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	import { currentProjectId } from '$lib/stores/user';

	export let data;
</script>

<div class="flex flex-1 items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<Card.Title>Select Project</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-2">
			{#each data.projects as project}
				<Button
					variant="secondary"
					href={`/projects/${project.id}`}
					on:click={() => currentProjectId.set(project.id)}>{project.name}</Button
				>
			{/each}
			<Button href="/projects/create" class="gap-1">
				<PlusIcon size={16} />
				<span>Create Project</span>
			</Button>
		</Card.Content>
	</Card.Root>
</div>
