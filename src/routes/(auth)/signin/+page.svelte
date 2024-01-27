<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

	$: searchParams = $page.url.searchParams;
	$: error = searchParams.get('error') === 'true';
	$: success = searchParams.get('success') === 'true';
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<Card.Root class="w-full max-w-[32rem]">
		<Card.Header>
			<Card.Title>Sign In</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-8">
			{#if success}
				<Alert.Root>
					<Alert.Title>Heads up!</Alert.Title>
					<Alert.Description>We've just sent you an email with a link to sign in.</Alert.Description
					>
				</Alert.Root>
			{/if}
			{#if error}
				<Alert.Root variant="destructive">
					<Alert.Title>Oooops!</Alert.Title>
					<Alert.Description
						>There was a problem sending you the verification email.</Alert.Description
					>
				</Alert.Root>
			{/if}
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
