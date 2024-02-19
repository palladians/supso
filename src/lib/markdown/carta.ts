import { Carta } from 'carta-md';
import { emoji } from '@cartamd/plugin-emoji';
import { code } from '@cartamd/plugin-code';

export const carta = new Carta({
	disableIcons: true,
	extensions: [emoji(), code()]
});
