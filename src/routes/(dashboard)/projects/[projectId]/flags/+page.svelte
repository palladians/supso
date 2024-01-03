<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Switch } from '$lib/components/ui/switch';
	import { currentProjectId } from '$lib/stores/user';
	import { PlusIcon } from 'lucide-svelte';
	import DeleteFlagAlert from '$lib/components/alerts/delete-flag-alert.svelte';
	import { writable } from 'svelte/store';

	export let data;
	$: currentProject = data.projects.find((project) => project.id === $currentProjectId);

	export const deleteFlagAlertId = writable<string | null>(null);
</script>

<div class="flex flex-1 items-center justify-center">
	<DeleteFlagAlert open={deleteFlagAlertId} />
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<div class="flex items-center justify-between">
				<Card.Title>{currentProject?.name} Feature Flags</Card.Title>
				<Button
					href={`/projects/${$currentProjectId}/flags/create`}
					variant="secondary"
					size="sm"
					class="gap-1"
				>
					<PlusIcon size={16} />
					<span>Create Flag</span>
				</Button>
			</div>
		</Card.Header>
		<Card.Content>
			<Accordion.Root>
				{#each data.featureFlags as featureFlag}
					<Accordion.Item value={featureFlag.id}>
						<Accordion.Trigger>
							<div class="flex gap-2">
								<Badge variant={featureFlag.enabled === 'true' ? 'default' : 'secondary'}
									>{featureFlag.enabled === 'true' ? 'On' : 'Off'}</Badge
								>
								<span>{featureFlag.name}</span>
							</div>
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="flex flex-col gap-2">
								{#if featureFlag.description}
									<p>
										{featureFlag.description}
									</p>
								{/if}
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-4">
										<Button
											href={`/projects/${$currentProjectId}/flags/${featureFlag.id}`}
											variant="link"
											class="p-0">Edit</Button
										>
										<Button
											variant="link"
											class="p-0"
											on:click={() => deleteFlagAlertId.set(featureFlag.id)}>Delete</Button
										>
									</div>
									<form method="POST" action="?/toggleFlag">
										<input type="hidden" name="flagId" value={featureFlag.id} />
										<Switch type="submit" checked={featureFlag.enabled === 'true'} />
									</form>
								</div>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</div>
