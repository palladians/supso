<script lang="ts">
	import { Carta, CartaEditor } from 'carta-md';
	import { emoji } from '@cartamd/plugin-emoji';
	import { slash } from '@cartamd/plugin-slash';
	import { code } from '@cartamd/plugin-code';
	import 'carta-md/dark.css';
	import '$lib/styles/github.scss';

	export let value: string;
	export let onBlur: (value: string) => void;

	const carta = new Carta({
		extensions: [
			emoji(),
			slash(),
			code(),
			{ listeners: [['blur', (event) => onBlur(event.target.value)]] }
		]
	});
</script>

<CartaEditor bind:value mode="tabs" theme="github" {carta} />
