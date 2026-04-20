const BASE_URL_DEV = "http://localhost:8080"; 
const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app"; 

let api = `${BASE_URL_PROD}/api/liturgicalCalendars/v1`;

async function getAll({
	title
}) {
	const URL = paramsAssembly(title, api);
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter calendário litúrgico [getAll]");
	}

	return await response.json();
}

function paramsAssembly(title) {
	let params = new Map();

	if (title !== undefined) params.set('title', title);

	api = addParamsToRequest(params, api);
	api = removeLastCaracterOfApi(api);

	return api;
}

function addParamsToRequest(params, api) {
	if (params.size === 0) return api;

	api += `?`;

	if (params.size === 1) {
		for (let [key, value] of params) {
			api += `${key}=${value}`;
		}
		return api;
	}

	for (let [key, value] of params) {
		api += `${key}=${value}&`;
	}

	return api;
}

function removeLastCaracterOfApi(api) {
	if (api.slice(-1) === "&") {
		api = api.slice(0, -1);
	}
	return api;
}

export const LiturgicalCalendarService = {
	getAll
};