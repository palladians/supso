<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import { codeToHtml } from 'shiki';
	import dedent from 'dedent';
	import { derived, writable } from 'svelte/store';
	import { env as envPublic } from '$env/dynamic/public';
	import { CopyIcon, InfoIcon, ArrowUpRightIcon } from 'lucide-svelte';

	export let data;

	export const projectId = writable<string | undefined>();
	export const channel = writable<string>('');
	export const event = writable<string>('');
	export const emoji = writable<string | undefined>('🎉');
	export const notify = writable<boolean>(false);

	const getFetchTemplate = () => dedent`
      fetch('https://app.supso.co/api/log', {
        method: 'POST',
        body: JSON.stringify({
          projectId: '${$projectId ?? '[Specify Project]'}',
          channel: '${$channel}',
          event: '${$event}',
          emoji: '${$emoji}',
          notify: ${$notify}
        }),
        headers: {
          authorization: 'Bearer [ACCESS_TOKEN]'
		}
      })
	`;

	export const fetchHtml = derived([projectId, channel, event, emoji, notify], () =>
		codeToHtml(getFetchTemplate(), {
			lang: 'typescript',
			theme: 'rose-pine'
		})
	);

	export const executable = derived(
		[projectId, channel, event],
		() => $projectId && $channel && $event
	);

	export const execute = async () => {
		await fetch(envPublic.PUBLIC_APP_URL + '/api/log', {
			method: 'POST',
			body: JSON.stringify({
				projectId: $projectId,
				channel: $channel,
				event: $event,
				emoji: $emoji,
				notify: $notify
			}),
			headers: {
				authorization: 'Bearer ' + data.accessToken.id
			}
		});
	};
</script>

<div class="container flex flex-1 flex-col gap-4 py-4">
	<div class="flex">
		<h2 class="text-lg font-semibold">Playground</h2>
	</div>
	<div class="flex flex-col gap-4">
		<div class="grid grid-cols-2 gap-4">
			<Card.Root>
				<Card.Header>
					<Card.Title>Log Event</Card.Title>
					<Card.Description>
						Prepare an event body to start logging events in your app.
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<fieldset class="space-y-1">
						<Label>Project</Label>
						<Select.Root onSelectedChange={({ value }) => projectId.set(value)}>
							<Select.Trigger>
								<Select.Value placeholder="Project" />
							</Select.Trigger>
							<Select.Content>
								{#each data.projects as project}
									<Select.Item value={project.id}>{project.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</fieldset>
					<fieldset class="space-y-1">
						<Label>Channel</Label>
						<Input
							value={$channel}
							on:input={(inputEvent) => channel.set(inputEvent.target.value)}
						/>
					</fieldset>
					<fieldset class="space-y-1">
						<Label>Event</Label>
						<Input value={$event} on:input={(inputEvent) => event.set(inputEvent.target.value)} />
					</fieldset>
					<fieldset class="space-y-1">
						<Label>Emoji</Label>
						<Input value={$emoji} on:input={(inputEvent) => emoji.set(inputEvent.target.value)} />
					</fieldset>
					<fieldset class="flex items-center space-x-2">
						<Switch checked={$notify} onCheckedChange={(value) => notify.set(value)} />
						<Label>Notify</Label>
					</fieldset>
					<Button disabled={!$executable} on:click={execute} class="w-full gap-2 self-end">
						<ArrowUpRightIcon size={16} />
						<span>Execute Event</span>
					</Button>
				</Card.Content>
			</Card.Root>
			<div class="flex flex-col space-y-4">
				<Tabs.Root value="account">
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="account">Fetch</Tabs.Trigger>
						<Tabs.Trigger value="password">SDK [Coming Soon]</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="account">
						<Card.Root class="overflow-hidden bg-[#191723] p-4">
							{#await $fetchHtml}
								<p>loading</p>
							{:then html}
								<div>{@html html}</div>
							{/await}
						</Card.Root>
					</Tabs.Content>
					<Tabs.Content value="password">
						<Card.Root class="p-4">SDK</Card.Root>
					</Tabs.Content>
				</Tabs.Root>
				<Alert.Root>
					<InfoIcon size={20} />
					<Alert.Description class="mt-1"
						>Get the Accees Token from <a href="/profile" class="underline">your Profile</a
						>.</Alert.Description
					>
				</Alert.Root>
				<Button variant="secondary" class="gap-2">
					<CopyIcon size={16} />
					<span>Copy Code</span>
				</Button>
			</div>
		</div>
	</div>
</div>
