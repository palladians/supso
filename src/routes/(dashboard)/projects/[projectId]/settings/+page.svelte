<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeftIcon, XIcon, PlusIcon } from 'lucide-svelte';
	import { page } from '$app/stores';

	export const roles = [
		{ value: 'member', label: 'Member' },
		{ value: 'admin', label: 'Admin' }
	];

	export let data;
	$: currentOwner = data.membersOptions.find((member) => member.value === data.project.ownerId);
	$: isOwner = data.user.userId === data.project.ownerId;
</script>

<div class="flex flex-1 items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<div class="flex items-center gap-4">
				<Button href={`/projects/${$page.params.projectId}`} variant="secondary" size="icon">
					<ChevronLeftIcon size={16} />
				</Button>
				<Card.Title>Project Settings</Card.Title>
			</div>
		</Card.Header>
		<Card.Content class="flex flex-col gap-8">
			<form class="flex flex-col gap-4">
				<fieldset class="flex flex-col gap-2">
					<Label for="projectName">Project Name</Label>
					<Input id="projectName" name="name" bind:value={data.project.name} />
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<Label for="ownerId">Project Owner</Label>
					<Select.Root bind:selected={currentOwner} bind:items={data.membersOptions}>
						<Select.Trigger>
							<Select.Value placeholder="Project Owner" />
						</Select.Trigger>
						<Select.Content>
							{#each data.membersOptions as user}
								<Select.Item value={user.value}>{user.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</fieldset>
				<Button class="self-end">Update Project</Button>
			</form>
			<Separator />
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold">Members</h2>
					<Button variant="secondary" class="gap-1">
						<PlusIcon size={16} />
						Invite Member
					</Button>
				</div>
				{#each data.members as membership}
					{@const role = { value: membership.role, label: membership.role }}
					<Card.Root class="flex items-center gap-4 px-4 py-2">
						<Avatar.Root>
							<Avatar.Fallback class="capitalize">{membership.user.username[0]}</Avatar.Fallback>
						</Avatar.Root>
						<p class="flex-1 text-ellipsis">{membership.user.username}</p>
						<Select.Root selected={role} items={roles}>
							<Select.Trigger>
								<Select.Value placeholder="Role" class="capitalize" />
							</Select.Trigger>
							<Select.Content>
								{#each roles as role}
									<Select.Item value={role.value}>{role.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						{#if isOwner}
							<Button variant="ghost" size="icon">
								<XIcon size={16} />
							</Button>
						{/if}
					</Card.Root>
				{/each}
			</div>
			<Separator />
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold">Danger Zone</h2>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
