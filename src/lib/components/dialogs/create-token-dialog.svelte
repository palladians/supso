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
			<Dialog.Title>Create Token</Dialog.Title>
		</Dialog.Header>
		<form id="tokenForm" action="?/createToken" method="POST" class="flex flex-col gap-4">
			<fieldset class="flex flex-col gap-2">
				<Label for="tokenName">Token Name</Label>
				<Input id="tokenName" name="name" required />
			</fieldset>
		</form>
		<Dialog.Footer>
			<Button type="submit" form="tokenForm">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
