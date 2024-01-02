<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { ChevronDownIcon, PlusIcon } from 'lucide-svelte';
	import type { Project } from '$lib/db/schema';
	import { currentProjectId } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	$: currentProject = $page.data.projects.find(
		(project: Project) => project.id === $currentProjectId
	);
	export let nonNullProjectId = $currentProjectId ?? '';

	export const setCurrentProjectId = (projectId: string) => {
		currentProjectId.set(projectId);
		return goto(`/projects/${projectId}`);
	};

	export const isActive = (pathname: string) => $page.url.pathname === pathname;
</script>

<div class="flex items-center justify-between border-b p-2">
	<div class="items-center gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				{#if currentProject}
					<Button variant="outline" builders={[builder]} class="gap-1" size="sm">
						<span>{currentProject.name}</span>
						<ChevronDownIcon size={16} />
					</Button>
				{/if}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.RadioGroup bind:value={nonNullProjectId}>
					{#each $page.data.projects as project}
						<DropdownMenu.RadioItem
							value={project.id}
							on:click={() => setCurrentProjectId(project.id)}
							>{project.name}</DropdownMenu.RadioItem
						>
					{/each}
				</DropdownMenu.RadioGroup>
				<DropdownMenu.Separator />
				<DropdownMenu.Item href="/projects">All Projects</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item href="/projects/create" class="gap-1">
					<PlusIcon size={16} />
					<span>Create Project</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Button
			href={`/projects/${currentProject?.id}`}
			variant={isActive(`/projects/${currentProject?.id}`) ? 'secondary' : 'ghost'}
			size="sm">Insights</Button
		>
		<Button
			href={`/projects/${currentProject?.id}/events`}
			variant={isActive(`/projects/${currentProject?.id}/events`) ? 'secondary' : 'ghost'}
			size="sm">Events</Button
		>
		<Button
			href={`/projects/${currentProject?.id}/boards`}
			variant={isActive(`/projects/${currentProject?.id}/boards`) ? 'secondary' : 'ghost'}
			size="sm">Boards</Button
		>
		<Button
			href={`/projects/${currentProject?.id}/flags`}
			variant={isActive(`/projects/${currentProject?.id}/flags`) ? 'secondary' : 'ghost'}
			size="sm">Feature Flags</Button
		>
	</div>
	<div class="flex">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root class="h-9 w-9">
					<Avatar.Fallback class="capitalize">{$page.data.user.username[0]}</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item href="/profile">Profile</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<form action="api/signout" method="POST" class="flex flex-1">
					<Button variant="ghost" size="sm" type="submit" class="flex-1 justify-start px-2"
						>Sign Out</Button
					>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
