<script lang="ts">
	import PageNavbar from '$lib/components/dashboard/page-navbar.svelte';
	import EmptyState from '$lib/components/dashboard/empty-state.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Switch } from '$lib/components/ui/switch';
	import { page } from '$app/stores';
	import { PlusIcon } from 'lucide-svelte';
	import DeleteFlagAlert from '$lib/components/alerts/delete-flag-alert.svelte';
	import { writable } from 'svelte/store';

	export let data;
	export const deleteFlagAlertId = writable<string | null>(null);
</script>

<div class="container flex flex-1">
	<DeleteFlagAlert open={deleteFlagAlertId} />
	<div class="flex flex-1 flex-col">
		<PageNavbar title="Feature Flags" length={data.featureFlags.length}>
			<Button
				href={`/projects/${$page.params.projectId}/flags/create`}
				variant="secondary"
				class="gap-1"
				slot="addon"
			>
				<PlusIcon size={16} />
				<span>Create Flag</span>
			</Button>
		</PageNavbar>
		<Card.Root class="flex-1 p-6">
			{#if data.featureFlags.length === 0}
				<EmptyState
					title="Create a feature flag"
					description="Feature management helps to maximize the value of every digital product."
					buttonHref={`/projects/${$page.params.projectId}/flags/create`}
					buttonLabel="Create Feature Flag"
				/>
			{:else}
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
												href={`/projects/${$page.params.projectId}/flags/${featureFlag.id}`}
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
			{/if}
		</Card.Root>
	</div>
</div>
