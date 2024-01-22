<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { Writable } from 'svelte/store';

	export let open: Writable<string | null>;
</script>

<AlertDialog.Root open={!!$open} onOpenChange={() => open.set(null)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This user will lose the access to this project.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form action="?/removeMember" method="POST">
				<input type="hidden" name="userId" value={$open} />
				<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
