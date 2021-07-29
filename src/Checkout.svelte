<script>
	import { basket } from "./store.js";
	import { onMount } from "svelte";

	let sucess, process, geoRef, email, address;

	$: total = $basket.reduce((sum, { price, qty }) => sum + price * qty, 0);

	const form = new SqPaymentForm({
		applicationId: "SQUARE_APP",
		autoBuild: false,
		inputClass: "sq-input",
		inputStyles: [
			{
				fontSize: "16px",
				lineHeight: "16px",
				fontFamily: "helvetica",
				backgroundColor: "#f8fffb",
			},
		],
		cardNumber: { elementId: "number" },
		cvv: { elementId: "cvv" },
		expirationDate: { elementId: "expiry", placeholder: "MM/YY" },
		postalCode: { elementId: "postcode" },
		callbacks: {
			cardNonceResponseReceived: (errors, nonce) => {
				process = true;
				fetch("/.netlify/functions/checkout", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						nonce,
						email,
						address: address.formatted_address,
						location: address.geometry.location,
						basket: $basket,
						total,
					}),
				}).then(r =>
					r.status == 201
						? ((sucess = true), ($basket = []))
						: ((process = false), alert("Failed to process order."))
				);
			},
		},
	});

	onMount(() => {
		form.build();

		const autocomplete = new google.maps.places.Autocomplete(geoRef, {
			types: ["address"],
			fields: ["formatted_address", "geometry"],
			strictBounds: true,
			bounds: new google.maps.LatLngBounds(
				{ lat: 50.819262, lng: -1.892759 },
				{ lat: 50.824576, lng: -1.885437 }
			),
		});

		autocomplete.addListener(
			"place_changed",
			() => (address = autocomplete.getPlace())
		);
	});
</script>

{#if sucess}
	<p style="text-align: center" class="outline">
		Your order was processed successfully and a receipt emailed to you.<br />
		Thanks for shopping with us.
	</p>
{:else if total < 100}
	<p style="text-align: center" class="outline">
		We can't afford to process a payment of less than £1.<br />
		Add another item to your basket.
	</p>
{:else}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<form on:submit|preventDefault={async () => form.requestCardNonce()}>
		<div style="display: flex; flex-wrap: wrap; justify-content: space-between">
			<label style="width: 25rem">
				Email Address
				<input bind:value={email} type="email" autocomplete="email" required />
			</label>
			<label style="width: 25rem">
				House Number
				<input
					bind:this={geoRef}
					required
					placeholder
					type="search"
					on:keydown={e => e.key === "Enter" && e.preventDefault()}
				/>
			</label>
			<hr />
			<label style="width: 12rem">
				Card Number
				<div id="number" />
			</label>
			<label style="width: 6rem">
				Expiry Date
				<div id="expiry" />
			</label>
			<label style="width: 5rem">
				CVV
				<div id="cvv" />
			</label>
			<label style="width: 9rem">
				Billing Postcode
				<div id="postcode" />
			</label>
		</div>
		<button style="margin-top: 1.5rem"
			>{process ? "Processing ..." : "Pay £" + (total / 100).toFixed(2)}
		</button>
	</form>
{/if}
