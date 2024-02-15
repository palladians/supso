<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import {
		BarChart2Icon,
		PlusIcon,
		MessageSquareDotIcon,
		KanbanSquareIcon,
		FlagIcon,
		ChevronDownIcon,
		SearchIcon,
		InboxIcon,
		ListTodoIcon,
		CommandIcon,
		StarIcon
	} from 'lucide-svelte';
	import { sidebar } from '$lib/stores/sidebar';
	import { hosted } from '$lib/stores/hosted';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export const currentPathName = writable<string>($page.url.pathname);

	onMount(() => {
		const unsub = page.subscribe((newPage) => {
			currentPathName.set(newPage.url.pathname);
		});
		return () => {
			unsub();
		};
	});
</script>

<div
	class="bg-background sticky bottom-0 left-0 top-0 z-20 flex h-screen flex-1 flex-col justify-between border-r"
>
	<div class="flex flex-1 flex-col">
		<div class="flex flex-col items-center justify-between p-2 md:flex-row">
			<Button size="sm" href="/projects" variant="ghost" class="h-10 justify-start">
				<img src="/logo.svg" class="hidden h-6 md:flex" alt="Logo" />
				<img src="/logo-short.svg" class="flex h-6 md:hidden" alt="Logo" />
			</Button>
		</div>
		<div class="flex flex-col items-center gap-1 border-t p-2 md:items-stretch">
			<Button size="sm" variant="outline" class="w-full justify-between">
				<span>Search</span>
				<div class="flex items-center gap-1">
					<Badge variant="secondary" size="sm" class="gap-[2px]">
						<CommandIcon size={12} />
						<span>K</span>
					</Badge>
					<SearchIcon size={16} />
				</div>
			</Button>
			<Button
				href="/projects"
				size="sm"
				variant={$currentPathName === '/projects' ? 'outline' : 'ghost'}
				class={cn(
					'text-muted-foreground justify-start gap-2',
					$currentPathName === '/projects' && 'text-foreground'
				)}
			>
				<InboxIcon size={16} />
				<span>Inbox</span></Button
			>
			<Button
				size="sm"
				variant={$currentPathName === '/tasks' ? 'outline' : 'ghost'}
				class={cn(
					'text-muted-foreground justify-start gap-2',
					$currentPathName === '/tasks' && 'text-foreground'
				)}
			>
				<ListTodoIcon size={16} />
				<span>Tasks</span></Button
			>
		</div>
		{#each $page.data.projects as project, i}
			{@const collapsed = $sidebar?.[project.id]}
			<Collapsible.Root
				open={collapsed}
				onOpenChange={(value) => sidebar.set({ ...$sidebar, [project.id]: value })}
				class={cn(
					'flex flex-col items-center border-t px-2 py-1 md:items-stretch',
					i === $page.data.projects.length - 1 && 'border-b'
				)}
			>
				<Collapsible.Trigger asChild let:builder>
					<Button
						size="sm"
						builders={[builder]}
						variant="link"
						class="text-muted-foreground justify-between"
					>
						<span class="hidden text-xs md:flex">{project.name}</span>
						<ChevronDownIcon size={16} class={cn(collapsed && 'rotate-180 transition-transform')} />
					</Button>
				</Collapsible.Trigger>
				<Collapsible.Content class="flex flex-col gap-1">
					<Button
						size="sm"
						href={`/projects/${project?.id}`}
						variant={$currentPathName === `/projects/${project.id}` ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							$currentPathName === `/projects/${project.id}` && 'text-foreground'
						)}
					>
						<BarChart2Icon size={20} />
						<span class="hidden md:flex">Insights</span>
					</Button>
					<Button
						size="sm"
						href={`/projects/${project?.id}/events`}
						variant={$currentPathName === `/projects/${project.id}/events` ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							$currentPathName === `/projects/${project.id}/events` && 'text-foreground'
						)}
					>
						<MessageSquareDotIcon size={20} />
						<span class="hidden md:flex">Events</span></Button
					>
					<Button
						size="sm"
						href={`/projects/${project?.id}/boards`}
						variant={$currentPathName === `/projects/${project.id}/boards` ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							$currentPathName === `/projects/${project.id}/boards` && 'text-foreground'
						)}
					>
						<KanbanSquareIcon size={20} />
						<span class="hidden md:flex">Boards</span></Button
					>
					<Button
						size="sm"
						href={`/projects/${project?.id}/flags`}
						variant={$currentPathName === `/projects/${project.id}/flags` ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							$currentPathName === `/projects/${project.id}/flags` && 'text-foreground'
						)}
					>
						<FlagIcon size={20} />
						<span class="hidden md:flex">Feature Flags</span></Button
					>
					{#if !$hosted}
						<Button variant="ghost" size="sm" class="justify-start gap-2 text-teal-500">
							<StarIcon size={20} />
							<span class="hidden md:flex">Upgrade to Pro</span>
						</Button>
					{/if}
				</Collapsible.Content>
			</Collapsible.Root>
		{/each}
		<div class="flex flex-col p-2">
			<Button
				size="sm"
				href={`/projects/create`}
				variant={$currentPathName === '/projects/create' ? 'outline' : 'ghost'}
				class={cn(
					'justify-start gap-2',
					$currentPathName === '/projects/create' && 'text-foreground'
				)}
			>
				<PlusIcon size={20} />
				<span class="hidden md:flex">Create Project</span></Button
			>
		</div>
	</div>
	<div class="flex flex-col border-t p-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="ghost"
					class="justify-center gap-2 px-0 md:justify-start md:px-4"
				>
					<Avatar.Root class="h-8 w-8">
						<Avatar.Fallback class="capitalize">{$page.data.user.username[0]}</Avatar.Fallback>
					</Avatar.Root>
					<span class="hidden w-full max-w-[11rem] truncate md:flex"
						>{$page.data.user.username}</span
					>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item href="/profile">Profile</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<form action="/api/signout" method="POST" class="flex flex-1">
					<Button variant="ghost" size="sm" type="submit" class="flex-1 justify-start px-2"
						>Sign Out</Button
					>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
