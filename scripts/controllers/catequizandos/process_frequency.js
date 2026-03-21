import { MissaService } from '../../services/missa_service.js';
import { PresencaService } from '../../services/presenca_service.js';

export async function proccessTheFrequencyOfCatechumens(catechumen) {
	const masses = await MissaService.findAllMissa();
	const massesToThisToday = await MissaService.findByOccurredToThisTodayMissa();
	const presencesOfCatechumen = await PresencaService.findByCatechumenIdPresenca(catechumen.id);

	const totalMasses = masses.length;
	const totalMassesToThisToday = massesToThisToday.length;
	const attendanceAtMasses = presencesOfCatechumen.length;

	return calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses);
}

function calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses) {

	const frequencyActual = (attendanceAtMasses * 100) / totalMassesToThisToday;
	const frequencyTotal = (attendanceAtMasses * 100) / totalMasses;;

	return [frequencyActual, frequencyTotal];
}