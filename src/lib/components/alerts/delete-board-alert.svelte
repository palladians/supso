<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Writable } from 'svelte/store';

	export let open: Writable<string | null>;
</script>

<AlertDialog.Root open={!!$open} onOpenChange={() => open.set(null)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the board and the order of all its items.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form action="?/deleteBoard" method="POST">
				<input type="hidden" name="id" value={$open} />
				<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
