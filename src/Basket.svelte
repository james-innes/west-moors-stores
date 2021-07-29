<script>
	import { basket } from "./store.js";
</script>

{#if $basket.length <= 0}
	<p>Your basket is empty becuase you have not put anything in it.</p>
{:else}
	<table>
		{#each $basket as { code, img, name }, i}
			<tr>
				<td><img src={img} alt style="height: 3rem" /></td>
				<td>{name}</td>
				<td>
					<select
						bind:value={$basket[i].qty}
						on:blur={e => {
							if (e.target.value == "0") {
								$basket = $basket.filter(p => p.code != code);
							}
						}}
						style="width: min-content"
					>
						{#each Array(11) as _, i}
							<option value={i}>&#215; {i}</option>
						{/each}
					</select>
				</td>
			</tr>
		{/each}
	</table>
{/if}
