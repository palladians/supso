<script lang="ts">
	import Head from '$lib/components/head.svelte';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
</script>

<Head title="Sign In" />

<div class="flex min-h-screen flex-col items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<Card.Title>Sign In</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-8">
			<form method="POST" class="flex flex-col gap-4">
				<fieldset class="flex flex-col gap-2">
					<Label for="email">Email Address</Label>
					<Input id="email" name="email" />
				</fieldset>
				<Button type="submit">Sign In</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
