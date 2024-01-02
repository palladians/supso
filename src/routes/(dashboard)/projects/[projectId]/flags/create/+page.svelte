<script lang="ts">
    import * as Card from '$lib/components/ui/card'
    import { Label } from '$lib/components/ui/label'
    import { Input } from '$lib/components/ui/input'
    import { Button } from '$lib/components/ui/button'
</script>

<div class="flex flex-1 items-center justify-center">
    <Card.Root class="max-w-[32rem] w-full">
        <Card.Header>
            <div class="flex justify-between items-center">
                <Card.Title>Create Feature Flag</Card.Title>
            </div>
        </Card.Header>
        <Card.Content>
            <form method="POST" class="flex flex-col gap-4">
                <fieldset class="flex flex-col gap-2">
                    <Label for="flagName">Flag Name</Label>
                    <Input id="flagName" name="name" required />
                </fieldset>
                <fieldset class="flex flex-col gap-2">
                    <Label for="flagDescription">Flag Description</Label>
                    <Input id="flagDescription" name="description" required />
                </fieldset>
                <Button type="submit">Create Flag</Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>