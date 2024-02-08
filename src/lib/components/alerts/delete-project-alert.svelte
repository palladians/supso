<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { derived, writable, type Writable } from 'svelte/store';
	import { Input } from '../ui/input';
	import { page } from '$app/stores';

	export let open: Writable<string | null>;
	export let confirmation = writable<string>('');
	export const valid = derived([confirmation], () => $confirmation === $page.data.project.name);
</script>

<AlertDialog.Root open={!!$open} onOpenChange={() => open.set(null)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the project and all its
				belongings.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="space-y-2">
			<p class="text-muted-foreground text-sm">
				Type in the name of this project ({$page.data.project.name}) to continue.
			</p>
			<Input value={$confirmation} on:input={(event) => confirmation.set(event.target.value)} />
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form action="?/deleteProject" method="POST">
				<input type="hidden" name="projectId" value={$open} />
				<AlertDialog.Action type="submit" disabled={!$valid}>Continue</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
