<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { writable, type Writable } from 'svelte/store';

	export let open: Writable<boolean>;
	export let service = writable<string | undefined>();
</script>

<Dialog.Root open={$open} onOpenChange={(value) => open.set(value)}>
	<Dialog.Content class="sm:max-w-[512px]">
		<Dialog.Header>
			<Dialog.Title>Add Webhook</Dialog.Title>
		</Dialog.Header>
		<form id="webhookForm" action="?/addWebhook" method="POST" class="flex flex-col gap-4">
			<fieldset class="flex flex-col gap-2">
				<Label for="webhookUrl">Webhook URL</Label>
				<Input id="webhookUrl" name="url" required />
			</fieldset>
			<fieldset class="flex flex-col gap-2">
				<Label for="webhookService">Service</Label>
				<Select.Root onSelectedChange={(selected) => service.set(selected?.value ?? '')}>
					<Select.Trigger>
						<Select.Value placeholder="Select Service" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Services</Select.Label>
							<Select.Item value="discord">Discord</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</fieldset>
			<input type="hidden" name="service" value={$service} />
		</form>
		<Dialog.Footer>
			<Button type="submit" form="webhookForm">Add Webhook</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
