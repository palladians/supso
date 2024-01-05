<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { ChevronLeftIcon } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import DeleteBoardAlert from '$lib/components/alerts/delete-board-alert.svelte';

	export let data;

	export const deleteBoardAlertId = writable<string | null>(null);
</script>

<div class="flex flex-1 items-center justify-center">
	<DeleteBoardAlert open={deleteBoardAlertId} />
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<div class="flex items-center gap-4">
				<Button href={`/boards/${data.board.id}`} variant="secondary" size="icon">
					<ChevronLeftIcon size={16} />
				</Button>
				<Card.Title>Board Settings</Card.Title>
			</div>
		</Card.Header>
		<Card.Content class="flex flex-col gap-8">
			<form method="POST" action="?/updateBoard" class="flex flex-col gap-4">
				<fieldset class="flex flex-col gap-2">
					<Label for="boardName">Board Name</Label>
					<Input id="boardName" name="name" bind:value={data.board.name} />
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<Label for="boardTag">Board Tag</Label>
					<Input id="boardTag" name="tag" bind:value={data.board.tag} />
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<Label for="boardTagValues">Tag Values</Label>
					<Input id="boardTagValues" name="tagValues" bind:value={data.board.options} />
					<p class="text-muted-foreground text-sm">
						Separate values with comma. Like: "apple,pear,banana"
					</p>
				</fieldset>
				<Button type="submit">Update Board</Button>
			</form>
			<Separator />
			<div class="flex flex-col gap-4">
				<h2 class="font-semibold">Danger Zone</h2>
				<Button variant="secondary" on:click={() => deleteBoardAlertId.set(data.board.id)}
					>Delete Board</Button
				>
			</div>
		</Card.Content>
	</Card.Root>
</div>
