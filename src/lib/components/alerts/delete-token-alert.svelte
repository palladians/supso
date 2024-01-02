<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Writable } from 'svelte/store';

	export let open: Writable<string | null>;
</script>

<AlertDialog.Root open={!!$open} onOpenChange={(value) => open.set(null)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the token and all integrations
				using this token will be invalid.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form action="?/deleteToken" method="POST">
				<input type="hidden" name="id" value={$open} />
				<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
