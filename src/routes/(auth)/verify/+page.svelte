<script lang="ts">
	import Head from '$lib/components/head.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';

	export const userId = browser && $page.url.searchParams.get('uid');
</script>

<Head title="Sign In" />

<div class="flex min-h-screen flex-col items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<Card.Title>Verification</Card.Title>
			<Card.Description>A code to confirm your sign in request has been sent to your email address. Enter it and submit to verify.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-8">
			<form method="POST" class="flex flex-col gap-4">
				<input type="hidden" name="userId" value={userId} />
				<fieldset class="flex flex-col gap-2">
					<Label for="code">Code</Label>
					<Input id="code" name="code" />
				</fieldset>
				<Button type="submit">Verify</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
