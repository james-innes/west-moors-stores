import { writable } from "svelte-persistent-store/dist/local";
import array from "./catalog.csv";

export const catalog = array.map(row => {
	let [code, barcode, price, name, img, qty, cat] = row;
	return {
		code,
		barcode,
		price,
		name,
		img: "https://www.booker.co.uk/bbimages" + img,
		qty,
		cat,
	};
});

export const basket = writable("basket", [
	...catalog
		.filter(p => [126901, 127573].includes(p.code))
		.map(p => ({ ...p, qty: 1 })),
]);
