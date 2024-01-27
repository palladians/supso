<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeftIcon } from 'lucide-svelte';
	import { page } from '$app/stores';
</script>

<div class="flex flex-1 items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<div class="flex items-center gap-4">
				<Button href={`/projects/${$page.params.projectId}/boards`} variant="secondary" size="icon">
					<ChevronLeftIcon size={16} />
				</Button>
				<Card.Title>Create Board</Card.Title>
			</div>
		</Card.Header>
		<Card.Content>
			<form method="POST" class="flex flex-col gap-4">
				<fieldset class="flex flex-col gap-2">
					<Label for="boardName">Board Name</Label>
					<Input id="boardName" name="name" required />
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<Label for="boardTag">Board Tag</Label>
					<Input id="boardTag" name="tag" />
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<Label for="boardTag">Tag Values</Label>
					<Input id="boardTag" name="tagValues" />
					<p class="text-muted-foreground text-sm">
						Separate values with comma. Like: "apple,pear,banana"
					</p>
				</fieldset>
				<Button type="submit">Create Board</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
