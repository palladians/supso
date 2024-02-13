<script lang="ts">
	import Notifications from './notifications.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import {
		BarChart2Icon,
		PlusIcon,
		MessageSquareDotIcon,
		KanbanSquareIcon,
		FlagIcon,
		ChevronDownIcon
	} from 'lucide-svelte';
	import { sidebar } from '$lib/stores/sidebar';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { browser } from '$app/environment';

	export const isActive = (pathname: string) => browser && $page.url.pathname === pathname;
</script>

<div
	class="bg-background sticky bottom-0 left-0 top-0 z-20 flex h-screen flex-1 flex-col justify-between border-r"
>
	<div class="flex flex-col">
		<div class="flex justify-between p-2">
			<Button size="sm" href="/projects" variant="ghost" class="h-10 justify-start">
				<img src="/logo.svg" class="h-6" alt="Logo" />
			</Button>
			<Notifications />
		</div>
		{#each $page.data.projects as project, i}
			{@const collapsed = $sidebar?.[project.id]}
			<Collapsible.Root
				open={collapsed}
				onOpenChange={(value) => sidebar.set({ ...$sidebar, [project.id]: value })}
				class={cn('flex flex-col border-t p-2', i === $page.data.projects.length - 1 && 'border-b')}
			>
				<Collapsible.Trigger asChild let:builder>
					<Button
						size="sm"
						builders={[builder]}
						variant="link"
						class="text-muted-foreground justify-between"
					>
						<span>{project.name}</span>
						<ChevronDownIcon size={16} class={cn(collapsed && 'rotate-180 transition-transform')} />
					</Button>
				</Collapsible.Trigger>
				<Collapsible.Content class="flex flex-col gap-1">
					<Button
						size="sm"
						href={`/projects/${project?.id}`}
						variant={isActive(`/projects/${project.id}`) ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							isActive(`/projects/${project.id}`) && 'text-foreground'
						)}
					>
						<BarChart2Icon size={20} />
						<span>Insights</span>
					</Button>
					<Button
						size="sm"
						href={`/projects/${project?.id}/events`}
						variant={isActive(`/projects/${project.id}/events`) ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							isActive(`/projects/${project.id}/events`) && 'text-foreground'
						)}
					>
						<MessageSquareDotIcon size={20} />
						<span>Events</span></Button
					>
					<Button
						size="sm"
						href={`/projects/${project?.id}/boards`}
						variant={isActive(`/projects/${project.id}/boards`) ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							isActive(`/projects/${project.id}/boards`) && 'text-foreground'
						)}
					>
						<KanbanSquareIcon size={20} />
						<span>Boards</span></Button
					>
					<Button
						size="sm"
						href={`/projects/${project?.id}/flags`}
						variant={isActive(`/projects/${project.id}/flags`) ? 'outline' : 'ghost'}
						class={cn(
							'text-muted-foreground justify-start gap-2',
							isActive(`/projects/${project.id}/flags`) && 'text-foreground'
						)}
					>
						<FlagIcon size={20} />
						<span>Feature Flags</span></Button
					>
				</Collapsible.Content>
			</Collapsible.Root>
		{/each}
		<div class="flex flex-col border-b p-2">
			<Button size="sm" href={`/projects/create`} variant="ghost" class="justify-start gap-1">
				<PlusIcon size={16} />
				<span>Create Project</span></Button
			>
		</div>
	</div>
	<div class="flex flex-col border-t p-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="ghost" class="justify-start gap-2">
					<Avatar.Root class="h-8 w-8">
						<Avatar.Fallback class="capitalize">{$page.data.user.username[0]}</Avatar.Fallback>
					</Avatar.Root>
					<span class="w-full max-w-[11rem] truncate">{$page.data.user.username}</span>
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
