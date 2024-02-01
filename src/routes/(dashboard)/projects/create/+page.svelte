<script lang="ts">
	import Head from '$lib/components/head.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<Head title="Create Project" />

<div class="flex flex-1 items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<Card.Title>Create Project</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="POST" class="flex flex-col gap-4">
				<fieldset class="flex flex-col gap-2">
					<Label for="name">Project Name</Label>
					<Input id="name" name="name" />
				</fieldset>
				<Button type="submit">Create</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
