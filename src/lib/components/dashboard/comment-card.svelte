<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { type Comment } from '$lib/db/schema';
	import { formatDateShort } from '$lib/format/date';
	import { writable, type Writable } from 'svelte/store';
	import { Textarea } from '$lib/components/ui/textarea';
	import { page } from '$app/stores';

	export let comment: Comment;
	export let deleteCommentAlertId: Writable<string | null> | undefined;
	export let onReply: ((username: string) => void) | undefined;
	export let hideActions: boolean = false;
	export let editing = writable<boolean>(false);
	export const author = comment.userId === $page.data.user.id;
</script>

<Card.Root class="flex gap-2 p-4">
	<Avatar.Root class="h-8 w-8 text-sm">
		<Avatar.Fallback>{comment.user.username[0].toUpperCase()}</Avatar.Fallback>
	</Avatar.Root>
	<div class="flex flex-1 flex-col gap-2">
		<div class="flex gap-2">
			<div class="text-sm">{comment.user.username}</div>
			<div class="text-muted-foreground text-sm">{formatDateShort(comment.createdAt)}</div>
		</div>
		<div class="text-sm">
			{comment.content}
		</div>
		{#if !hideActions && !$editing}
			<div class="flex gap-2">
				{#if onReply}
					<Button
						variant="link"
						class="text-muted-foreground h-5 p-0 text-sm"
						on:click={() => onReply?.(comment.user.username)}>Reply</Button
					>
				{/if}
				{#if author}
					<Button
						variant="link"
						class="text-muted-foreground h-5 p-0 text-sm"
						on:click={() => editing.set(true)}>Edit</Button
					>
				{/if}
				<Button
					variant="link"
					class="text-muted-foreground h-5 p-0 text-sm"
					on:click={() => deleteCommentAlertId?.set(comment.id)}>Delete</Button
				>
			</div>
		{/if}
		{#if $editing}
			<form action="?/updateComment" method="POST" class="flex flex-col gap-2">
				<input type="hidden" name="id" value={comment.id} />
				<Textarea name="content" value={comment.content} />
				<Button type="submit" variant="secondary" size="sm" class="self-end">Save</Button>
			</form>
		{/if}
	</div>
</Card.Root>
