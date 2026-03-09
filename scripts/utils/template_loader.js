export async function loadTemplate(path) {
	const response = await fetch(path);
	const html = await response.text();

	const temp = document.createElement('div');
	temp.innerHTML = html;

	document.body.appendChild(temp);
}