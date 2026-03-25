const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";
const BASE_URL_DEV = "http://localhost:8080";

const API_BASE_URL_FIND_ALL = `${BASE_URL_DEV}/api/liturgicalCalendar/v1`;
const API_BASE_URL_FIND_DATE_BY_TITLE = `${BASE_URL_DEV}/api/liturgicalCalendar/v1/find-by?title={title}`;

async function findAll() {
	const response = await fetch(API_BASE_URL_FIND_ALL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter calendário litúrgico [findAll]");
	}

	return await response.json();
}

async function findByTitle(title) {
	const url = API_BASE_URL_FIND_DATE_BY_TITLE.replace('{title}', title);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter calendário litúrgico [findAll]");
	}

	return await response.json();
}

export const LiturgicalCalendarService = {
	findAll,
	findByTitle,
};