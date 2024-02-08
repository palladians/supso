<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { XIcon, PlusIcon, CheckIcon, CopyIcon, EyeIcon } from 'lucide-svelte';
	import CreateTokenDialog from '$lib/components/dialogs/create-token-dialog.svelte';
	import DeleteTokenAlert from '$lib/components/alerts/delete-token-alert.svelte';
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	export let data;
	export let username: string;
	export const createTokenDialogOpen = writable<boolean>(false);
	export const deleteTokenAlertId = writable<string | null>(null);

	$: username = username ?? data.user.username;
</script>

<div class="container flex flex-1 flex-col">
	<CreateTokenDialog open={createTokenDialogOpen} />
	<DeleteTokenAlert open={deleteTokenAlertId} />
	<h1 class="py-4 text-lg font-semibold">Profile</h1>
	<Card.Root class="grid flex-1 grid-cols-[1fr_2fr] flex-col gap-12 p-6">
		<h2 class="font-semibold">User</h2>
		<form action="?/updateProfile" method="POST" class="flex flex-col gap-4">
			<fieldset class="flex flex-col gap-2">
				<Label for="username">Username</Label>
				<Input id="username" name="username" bind:value={username} />
			</fieldset>
			<fieldset class="flex flex-col gap-2">
				<Label for="email">Email Address</Label>
				<Input id="email" value={data.user.email} disabled />
			</fieldset>
			<Button type="submit" class="self-end">Save</Button>
		</form>
		<Separator class="col-span-2" />
		<h2 class="font-semibold">Project Invitations</h2>
		<div class="flex flex-col gap-4">
			{#if data.projectInvitations.length === 0}
				<p class="text-sm">No active invitations</p>
			{/if}
			<div class="flex flex-col gap-4">
				{#each data.projectInvitations as invitation}
					<Card.Root class="flex items-center gap-2 px-4 py-2">
						<p class="flex-1">{invitation.project.name}</p>
						<form action="?/acceptInvitation" method="POST">
							<input type="hidden" name="id" value={invitation.id} />
							<Button type="submit" size="sm" class="gap-2">
								<CheckIcon size={16} />
								<span>Accept</span>
							</Button>
						</form>
						<form action="?/rejectInvitation" method="POST">
							<input type="hidden" name="id" value={invitation.id} />
							<Button type="submit" size="sm" variant="secondary" class="gap-2">
								<XIcon size={16} />
								<span>Decline</span>
							</Button>
						</form>
					</Card.Root>
				{/each}
			</div>
		</div>
		<Separator class="col-span-2" />
		<h2 class="font-semibold">Access Tokens</h2>
		<div class="flex flex-col gap-4">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head class="w-[12rem]">Token</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.accessTokens as token}
						<Table.Row>
							<Table.Cell class="font-medium">{token.name}</Table.Cell>
							<Table.Cell class="w-[20rem]">
								{#if token?.visible}
									<span>{token.id}</span>
								{:else}
									<Button
										variant="secondary"
										on:click={() => {
											token.visible = true;
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
									on:click={() => {
										toast('The access token was copied.');
										navigator.clipboard.writeText(token.id);
									}}
								>
									<CopyIcon size={16} />
								</Button>
								<Button
									size="icon"
									variant="secondary"
									on:click={() => deleteTokenAlertId.set(token.id)}
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
				on:click={() => createTokenDialogOpen.set(true)}
			>
				<PlusIcon size={16} />
				Create Token</Button
			>
		</div>
	</Card.Root>
</div>
