<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeftIcon, XIcon, PlusIcon, EyeIcon } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import InviteMemberDialog from '$lib/components/dialogs/invite-member-dialog.svelte';
	import AddWebhookDialog from '$lib/components/dialogs/add-webhook-dialog.svelte';
	import RemoveMemberAlert from '$lib/components/alerts/remove-member-alert.svelte';
	import DeleteProjectAlert from '$lib/components/alerts/delete-project-alert.svelte';
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import DeleteWebhookAlert from '$lib/components/alerts/delete-webhook-alert.svelte';

	export const roles = [
		{ value: 'member', label: 'Member' },
		{ value: 'admin', label: 'Admin' }
	];

	export let data;
	$: currentOwner = data.membersOptions.find((member) => member.value === data.project.ownerId);
	$: isOwner = data.user.id === data.project.ownerId;
	export const inviteMemberDialogOpen = writable<boolean>(false);
	export const addWebhookDialogOpen = writable<boolean>(false);
	export const removeMemberAlertId = writable<string | null>(null);
	export const deleteProjectAlertId = writable<string | null>(null);
	export const deleteWebhookAlertId = writable<string | null>(null);
</script>

<div class="container flex flex-1 flex-col">
	<InviteMemberDialog open={inviteMemberDialogOpen} />
	<RemoveMemberAlert open={removeMemberAlertId} />
	<DeleteProjectAlert open={deleteProjectAlertId} />
	<AddWebhookDialog open={addWebhookDialogOpen} />
	<DeleteWebhookAlert open={deleteWebhookAlertId} />
	<PageNavbar title="Project Settings" />
	<Card.Root class="grid flex-1 grid-cols-[1fr_2fr] gap-12 p-6">
		<h2 class="font-semibold">Project</h2>
		<form action="?/updateProject" method="POST" class="flex flex-col gap-4">
			<fieldset class="flex flex-col gap-2">
				<Label for="projectName">Project Name</Label>
				<Input id="projectName" name="name" bind:value={data.project.name} />
			</fieldset>
			<fieldset class="flex flex-col gap-2">
				<Label>Project Owner</Label>
				<input type="hidden" name="ownerId" value={currentOwner?.value} />
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
			<Button type="submit" class="self-end">Update Project</Button>
		</form>
		<Separator class="col-span-2" />
		<h2 class="font-semibold">Members</h2>
		<div class="flex flex-col gap-4">
			{#each data.members as membership, i}
				{@const role = { value: membership.role, label: membership.role }}
				<Card.Root class="flex items-center gap-4 px-4 py-2">
					<Avatar.Root class="h-8 w-8">
						<Avatar.Fallback class="capitalize">{membership.user.username[0]}</Avatar.Fallback>
					</Avatar.Root>
					<p class="flex-1 text-ellipsis text-sm">{membership.user.username}</p>
					<form action="?/updateRole" method="POST">
						<Select.Root
							selected={role}
							items={roles}
							onSelectedChange={async (newRole) => {
								if (!newRole) return;
								const data = new FormData();
								data.set('userId', membership.userId);
								data.set('role', newRole.value);
								await fetch('?/updateRole', {
									method: 'POST',
									body: data
								});
							}}
						>
							<Select.Trigger class="min-w-32">
								<Select.Value placeholder="Role" class="capitalize" />
							</Select.Trigger>
							<Select.Content>
								{#each roles as role}
									<Select.Item value={role.value}>{role.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</form>
					{#if isOwner}
						<Button
							variant="ghost"
							size="icon"
							on:click={() => removeMemberAlertId.set(membership.userId)}
						>
							<XIcon size={16} />
						</Button>
					{/if}
				</Card.Root>
			{/each}
			<Button
				variant="secondary"
				class="gap-1 self-end"
				on:click={() => inviteMemberDialogOpen.set(true)}
			>
				<PlusIcon size={16} />
				Invite Member
			</Button>
		</div>
		<Separator class="col-span-2" />
		<h2 class="font-semibold">Invitations</h2>
		<div class="flex flex-col gap-4">
			{#each data.projectInvitations as invitation}
				<Card.Root class="flex items-center gap-4 px-4 py-2">
					<Avatar.Root class="h-8 w-8">
						<Avatar.Fallback class="capitalize">{invitation.user.username[0]}</Avatar.Fallback>
					</Avatar.Root>
					<p class="flex-1 text-ellipsis text-sm">{invitation.user.username}</p>
					{#if isOwner}
						<form action="?/deleteInvitation" method="POST">
							<input type="hidden" name="invitationId" value={invitation.id} />
							<Button type="submit" variant="ghost" size="icon">
								<XIcon size={16} />
							</Button>
						</form>
					{/if}
				</Card.Root>
			{/each}
		</div>
		<Separator class="col-span-2" />
		<h2 class="font-semibold">Webhooks</h2>
		<div class="flex flex-col gap-4">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Service</Table.Head>
						<Table.Head>URL</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.webhooks as webhook}
						<Table.Row>
							<Table.Cell class="font-medium">{webhook.service}</Table.Cell>
							<Table.Cell class="w-[20rem]">
								{#if webhook?.visible}
									<div class="max-w-[32rem] break-all">{webhook.url}</div>
								{:else}
									<Button
										variant="secondary"
										on:click={() => {
											webhook.visible = true;
										}}
										class="gap-1"
									>
										<EyeIcon size={16} />
										<span>Reveal</span>
									</Button>
								{/if}
							</Table.Cell>
							<Table.Cell class="flex justify-end gap-2">
								<Button
									size="icon"
									variant="secondary"
									on:click={() => deleteWebhookAlertId.set(webhook.id)}
								>
									<XIcon size={16} />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<Button
				variant="secondary"
				class="gap-1 self-end"
				on:click={() => addWebhookDialogOpen.set(true)}
			>
				<PlusIcon size={16} />
				Add Webhook
			</Button>
		</div>
		<Separator class="col-span-2" />
		<h2 class="font-semibold">Danger Zone</h2>
		<div class="flex flex-col gap-4">
			<Button
				variant="secondary"
				class="self-end"
				on:click={() => deleteProjectAlertId.set(data.project.id)}>Delete Project</Button
			>
		</div>
	</Card.Root>
</div>
