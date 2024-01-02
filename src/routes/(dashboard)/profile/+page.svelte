<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { XIcon } from 'lucide-svelte';
	import CreateTokenDialog from '$lib/components/dialogs/create-token-dialog.svelte';
	import DeleteTokenAlert from '$lib/components/alerts/delete-token-alert.svelte';
	import { writable } from 'svelte/store';

	export let data;
	export let username: string;
	export const createTokenDialogOpen = writable<boolean>(false);
	export const deleteTokenAlertId = writable<string | null>(null);

	$: username = username ?? data.user.username;
</script>

<div class="flex flex-1 items-center justify-center">
	<CreateTokenDialog open={createTokenDialogOpen} />
	<DeleteTokenAlert open={deleteTokenAlertId} />
	<Card.Root class="max-w-[32rem] w-full">
		<Card.Header>
			<Card.Title>Profile</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-8">
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
			<Separator />
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold">Access Tokens</h2>
					<Button variant="secondary" on:click={() => createTokenDialogOpen.set(true)}
						>Create Token</Button
					>
				</div>
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
								<Table.Cell class="w-[12rem]">{token.id}</Table.Cell>
								<Table.Cell class="flex justify-end">
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
			</div>
		</Card.Content>
	</Card.Root>
</div>
