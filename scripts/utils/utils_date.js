function formatDateTimeThisMissa(dateTime) {
	return dateTime.slice(0, 10);
}

function returnsMonthAsAString(month) {
	switch (month) {
		case '01': return 'Janeiro';
		case '02': return 'Fevereiro';
		case '03': return 'Março';
		case '04': return 'Abril';
		case '05': return 'Maio';
		case '06': return 'Junho';
		case '07': return 'Julho';
		case '08': return 'Agosto';
		case '09': return 'Setembro';
		case '10': return 'Outubro';
		case '11': return 'Novembro';
		case '12': return 'Dezembro';
	}
}

export const UtilsDate = {
	formatDateTimeThisMissa,
	returnsMonthAsAString
};