<script lang="ts">
	import { CartaEditor, Carta } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { code } from '@cartamd/plugin-code';
	import 'carta-md/dark.css';
	import '$lib/styles/discord.scss';

	export let value: string;
	export let onChange: (value: string) => void;

	export const carta = new Carta({
		disableIcons: true,
		extensions: [
			emoji(),
			code(),
			{ listeners: [['change', (event) => onChange(event.target.value)]] }
		]
	});
</script>

<CartaEditor
	bind:value
	placeholder="Leave a comment for this event"
	mode="tabs"
	theme="discord"
	{carta}
></CartaEditor>
