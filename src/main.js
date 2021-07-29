import App from "./App.svelte";

document.addEventListener("touchstart", () => {}, false);

document.querySelectorAll("input").forEach(el => {
	el.addEventListener("invalid", el.classList.add("error"), false);
	el.addEventListener("blur", el.checkValidity());
});

const app = new App({
	target: document.body,
});

export default app;
