<script lang="ts">
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { CalendarIcon } from 'lucide-svelte';
	import { DateFormatter, CalendarDate } from '@internationalized/date';
	import { derived, type Writable } from 'svelte/store';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	export let placeholder: string;
	export let value: Writable<string | null>;
	export const calendarValue = derived(value, ($value) => {
		if (!$value) return;
		const date = new Date(parseInt($value));
		return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
	});
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'w-[180px] justify-start text-left font-normal',
				!$value && 'text-muted-foreground'
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{$value ? df.format(new Date(parseInt($value))) : placeholder}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar
			value={$calendarValue}
			onValueChange={(newDate) => {
				if (!newDate) return value.set(null);
				value.set(newDate.toDate('UTC').getTime().toString());
			}}
			class="rounded-md border shadow"
		/>
	</Popover.Content>
</Popover.Root>
