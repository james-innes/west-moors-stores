<script>
	import { onMount } from "svelte";

	let map, mapRef;

	onMount(() => {
		map = new google.maps.Map(mapRef, {
			mapId: "7554b4d98478747e",
			disableDefaultUI: true,
		});

		map.fitBounds({
			north: 50.824048,
			south: 50.820123,
			east: -1.886569,
			west: -1.891698,
		});

		new google.maps.Polygon({
			paths: [
				[
					{ lat: 50.82406576193079, lng: -1.889089738067622 },
					{ lat: 50.82375399837548, lng: -1.8888268815841625 },
					{ lat: 50.82394037901209, lng: -1.888113413986201 },
					{ lat: 50.82261197713806, lng: -1.8872121917571971 },
					{ lat: 50.82221209366289, lng: -1.8880222188796947 },
					{ lat: 50.82183254007784, lng: -1.887362395462031 },
					{ lat: 50.82135809375784, lng: -1.8873087512817333 },
					{ lat: 50.8198649698566, lng: -1.889691129400075 },
					{ lat: 50.82060716106164, lng: -1.8908981234567768 },
					{ lat: 50.82120022774604, lng: -1.8911609799402362 },
					{ lat: 50.82154928633027, lng: -1.8917081505792743 },
					{ lat: 50.82308161882672, lng: -1.89159772705505 },
					{ lat: 50.823329000163454, lng: -1.8913992435879479 },
				],
			],
			strokeColor: "#24CE98",
			strokeWeight: 3,
			fillOpacity: 0,
		}).setMap(map);
	});
</script>

<p class="outline">
	Welcome to the West Moors Stores, an independent family-run service for
	locals, providing convenient deliveries of food and household essentials to
	your door. This is a new venture and if enough of the community finds use in
	our services we hope to develop and be able to offer a greater selection of
	products including fresh and refrigerated produce as well as delivering to a
	larger area of West Moors. You don't need to create an account with us or wait
	for a delivery slot. Just place an order during the working week and we
	deliver every weekend. If you do not live in the area marked in the map below
	we won't deliver to you. You can contact us by
	<a href="mailto:contact@westmoorsstores.com">email</a>.
</p>

<div class="outline" style="padding: 0 0 1rem 0">
	<div bind:this={mapRef} id="map" style="height: 30rem" />
	<button
		on:click={() => map.setCenter({ lat: 50.822, lng: -1.8893 })}
		style="margin-left: 1rem"
	>
		Center
	</button>
	<button on:click={() => map.setMapTypeId("hybrid")}>Satellite</button>
	<button on:click={() => map.setMapTypeId("roadmap")}>Map</button>
	<button on:click={() => map.setZoom(map.getZoom() + 1)}>&plus</button>
	<button on:click={() => map.setZoom(map.getZoom() - 1)}>&minus</button>
</div>
