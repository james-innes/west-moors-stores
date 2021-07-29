<script>
	import Notice from "./Notice.svelte";
	import Products from "./Products.svelte";
	import Basket from "./Basket.svelte";
	import Checkout from "./Checkout.svelte";

	let open;
</script>

<img class="logo" src="logo.svg" alt />
<img src="banner.jpg" alt style="min-height: 13rem; object-fit: cover" />

<Notice />
<div class="split">
	<div class="outline">
		<h3>Basket</h3>
		<Basket />
		<button on:click={() => (open = true)}>Checkout</button>
	</div>
	<div class="outline" style="max-width: 20rem; align-items: center">
		<img src="offer.png" alt style="height: 11rem; margin-right: 2rem" />
		<p>
			Receive Tim the teddy bear free on your first purchase of some milk and
			bread.
		</p>
	</div>
</div>
<Products />

{#if open}
	<div class="modal outline" style="max-width: 25rem">
		<div>
			<h3 style="margin-top: 0">Checkout</h3>
			<button class="close" on:click={() => (open = false)}>Close</button>
		</div>
		<Checkout />
	</div>
{/if}

<style lang="sass" global>
	@import "styles"

	.logo
		display: block
		margin: 1.5rem auto
		height: 3rem

		@media (max-width: 760px)
			margin: 1rem auto
			height: 2.5rem

	.split
		@media (min-width: 740px)
			display: flex
			>
				:first-child
					margin-right: 2rem
				
				:last-child
					display: flex
</style>
