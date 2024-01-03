<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeftIcon } from 'lucide-svelte';
	import { currentProjectId } from '$lib/stores/user';

	export let data;
	export const formData = {
		name: data.flag?.name ?? '',
		description: data.flag?.description ?? ''
	};
</script>

<div class="flex flex-1 items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<div class="flex items-center gap-4">
				<Button href={`/projects/${$currentProjectId}/flags`} variant="secondary" size="icon">
					<ChevronLeftIcon size={16} />
				</Button>
				<Card.Title>Edit "{data.flag?.name}"</Card.Title>
			</div>
		</Card.Header>
		<Card.Content>
			<form method="POST" class="flex flex-col gap-4">
				<fieldset class="flex flex-col gap-2">
					<Label for="flagName">Flag Name</Label>
					<Input id="flagName" name="name" bind:value={formData.name} required />
				</fieldset>
				<fieldset class="flex flex-col gap-2">
					<Label for="flagDescription">Flag Description</Label>
					<Input id="flagDescription" name="description" bind:value={formData.description} />
				</fieldset>
				<Button type="submit">Update Flag</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
