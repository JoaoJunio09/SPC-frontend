export function formatStep(step) {
	if (step === "CRISMA") return "Crisma";
	else if (step === "PRE_CRISMA") return "Pré-Crisma";
	else if (step === "EUCARISTIA") return "Eucarista";
	else if (step === "PRIMEIRA_ETAPA") return "1º Etapa";
	else return "2º Etapa";
}