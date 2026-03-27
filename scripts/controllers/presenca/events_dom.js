import { dom, init } from "./register_presence_controller.js";

document.addEventListener('DOMContentLoaded', init());

dom.toogleAccordion.addEventListener('click', () => {
	const content = document.getElementById('accordionContent');
  content.classList.toggle('open');
});