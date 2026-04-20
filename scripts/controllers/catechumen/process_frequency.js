import { MassService } from '../../services/mass_service.js';
import { PresenceService } from '../../services/presence_service.js';
import { LiturgicalCalendarService } from '../../services/liturgical_calendar_service.js';

export async function proccessTheFrequencyOfCatechumens(catechumen) {
	
	const totalMasses = await getTotalMasses();
	const totalMassesToThisToday = await getMassesToThisToday();
	const presencesOfCatechumen = await PresenceService.getAll({catechumenId: catechumen.id});

	const attendanceAtMasses = presencesOfCatechumen.length;

	return calculateFrequency(totalMasses, totalMassesToThisToday, attendanceAtMasses);
}

async function getTotalMasses() {
	const masses = await MassService.getAll({});
	const totalDatesOfLiturgicalCalendar = await LiturgicalCalendarService.getAll({});

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
	const todayDate = new Date();

	const year      = todayDate.getFullYear();
	let month 			= todayDate.getMonth();
	const day 			= todayDate.getDate();
	const hours 		= todayDate.getHours();
	const minutes 	= todayDate.getMinutes();

	if (month.toString().charAt().length === 1) {
		month = `0${month}`;
	}

	const today = `${year}-${month}-${day}T${hours}:${minutes}:00`;
	
	const massesToThisToday = await MassService.getAll({occurredUntil: today});
	const totalDatesOfLiturgicalCalendar = await LiturgicalCalendarService.getAll({});

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
	const frequencyTotal = (attendanceAtMasses * 100) / totalMasses;

	return [frequencyActual, frequencyTotal];
}