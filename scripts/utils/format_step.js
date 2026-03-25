export function formatStep(step) {
	if (step === "CRISMA") return "Crisma";
	else if (step === "PRE_CRISMA") return "Pré-Crisma";
	else if (step === "EUCARISTIA_UM") return "Eucarista 1";
	else if (step === "EUCARISTIA_DOIS") return "Eucarista 2";
	else if (step === "PRIMEIRA_ETAPA") return "1º Etapa";
	else return "2º Etapa";
}