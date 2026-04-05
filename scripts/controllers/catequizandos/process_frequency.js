import { MassService } from '../../services/mass_service.js';
import { PresencaService } from '../../services/presenca_service.js';
import { LiturgicalCalendarService } from '../../services/liturgical_calendar.js';

export async function proccessTheFrequencyOfCatechumens(catechumen) {
	
	const totalMasses = await getTotalMasses();
	const totalMassesToThisToday = await getMassesToThisToday();
	const presencesOfCatechumen = await PresencaService.findByCatechumenIdPresenca(catechumen.id);

	const attendanceAtMasses = presencesOfCatechumen.length;

	return calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses);
}

async function getTotalMasses() {
	const masses = await MassService.findAllMissa();
	const totalDatesOfLiturgicalCalendar = await LiturgicalCalendarService.findAll();

	let counterMass = [];

	masses.forEach(mass => {
		totalDatesOfLiturgicalCalendar.forEach(liturgicalCalendar => {
			if (liturgicalCalendar.id === mass.massOfLiturgicalCalendarId) {
				if (!counterMass.includes(liturgicalCalendar.id)) {
					counterMass.push(liturgicalCalendar.id);
				}
			}
		})
	});

	return counterMass.length;
}

async function getMassesToThisToday() {
	const massesToThisToday = await MassService.findByOccurredToThisTodayMissa();
	const totalDatesOfLiturgicalCalendar = await LiturgicalCalendarService.findAll();

	let counterMass = [];

	massesToThisToday.forEach(mass => {
		totalDatesOfLiturgicalCalendar.forEach(liturgicalCalendar => {
			if (liturgicalCalendar.id === mass.massOfLiturgicalCalendarId) {
				if (!counterMass.includes(liturgicalCalendar.id)) {
					counterMass.push(liturgicalCalendar.id);
				}
			}
		})
	});

	return counterMass.length;
}

function calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses) {
	if (totalMassesToThisToday < 1 || attendanceAtMasses < 1) {
		return [0, 0];
	}

	const frequencyActual = (attendanceAtMasses * 100) / totalMassesToThisToday;
	const frequencyTotal = (attendanceAtMasses * 100) / totalMasses;;

	return [frequencyActual, frequencyTotal];
}