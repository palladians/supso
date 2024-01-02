<script lang="ts">
    import * as Card from '$lib/components/ui/card'
    import * as Accordion from '$lib/components/ui/accordion'
    import {Button} from '$lib/components/ui/button'
	import { currentProjectId } from '$lib/stores/user';
    import { PlusIcon } from 'lucide-svelte'

    export let data
    $: currentProject = data.projects.find((project) => project.id === $currentProjectId)
</script>

<div class="flex flex-1 items-center justify-center">
    <Card.Root class="max-w-[32rem] w-full">
        <Card.Header>
            <div class="flex justify-between items-center">
                <Card.Title>{currentProject?.name} Feature Flags</Card.Title>
                <Button href={`/projects/${$currentProjectId}/flags/create`} variant="secondary" size="sm" class="gap-1">
                    <PlusIcon size={16} />
                    <span>Create Flag</span>
                </Button>
            </div>
        </Card.Header>
        <Card.Content>
            <Accordion.Root>
                <Accordion.Item value="item-1">
                  <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
                  <Accordion.Content>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-2">
                  <Accordion.Trigger>Is it styled?</Accordion.Trigger>
                  <Accordion.Content>
                    Yes. It comes with default styles that matches the other components'
                    aesthetic.
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                  <Accordion.Trigger>Is it animated?</Accordion.Trigger>
                  <Accordion.Content>
                    Yes. It's animated by default, but you can disable it if you prefer.
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
        </Card.Content>
    </Card.Root>
</div>