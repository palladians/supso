<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { Writable } from 'svelte/store';

	export let open: Writable<boolean>;
</script>

<Dialog.Root open={$open} onOpenChange={(value) => open.set(value)}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Invite Member</Dialog.Title>
		</Dialog.Header>
		<form id="tokenForm" action="?/inviteMember" method="POST" class="flex flex-col gap-4">
			<fieldset class="flex flex-col gap-2">
				<Label for="emailAddress">Email Address</Label>
				<Input id="emailAddress" name="email" required />
			</fieldset>
		</form>
		<Dialog.Footer>
			<Button type="submit" form="tokenForm">Invite</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
