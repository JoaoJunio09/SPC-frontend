export function rendererLoading() {
	const template = document.getElementById("template-loading");
	const loading = template.content.cloneNode(true);
	document.body.appendChild(loading);
	return document.getElementById("loadingModal");
}