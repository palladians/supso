<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
</script>

<div>
	<form method="POST">
		<fieldset>
			<Label>Email Address</Label>
			<Input name="email" />
		</fieldset>
		<Button type="submit">Sign In</Button>
	</form>
</div>
