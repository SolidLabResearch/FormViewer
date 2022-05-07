import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		"name" : "Acme Form Viewer"
	}
});

export default app;