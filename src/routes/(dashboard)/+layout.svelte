<script lang="ts">
	import Navbar from '$lib/components/dashboard/navbar.svelte';
	import Footer from '$lib/components/dashboard/footer.svelte';
</script>

<main class="flex min-h-screen flex-1 flex-col gap-4">
	<Navbar />
	<div class="container flex flex-1 flex-col p-2 pb-24">
		<slot />
	</div>
	<Footer />
</main>
