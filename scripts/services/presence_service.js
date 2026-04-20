import { Exceptions } from "../exceptions/exceptions.js";
import { AppStore } from "../store/appStore.js";

const BASE_URL_DEV = "http://localhost:8080";
const BASE_URL_PROD = "https://spc-springboot-production.up.railway.app";

let api = `${BASE_URL_PROD}/api/presences/v1`;

const CACHE_KEY = 'presences_cache';

function getFromCache() {
	const inMemory = AppStore.getPresences();
	if (inMemory) return inMemory;

	const cache = sessionStorage.getItem(CACHE_KEY);
	if (cache) {
		const parsed = JSON.parse(cache);
		AppStore.setPresences(parsed);
		return parsed;
	}
	
	return null;
}

function clearCache() {
	AppStore.setPresences(null);
	sessionStorage.removeItem(CACHE_KEY);
}

async function getAll({
	catechumenId,
	titleMass
}) {
	const useParams = verifyRequestUseParams(catechumenId, titleMass);

	const cached = getFromCache();
	if (cached) return cached;

	const URL = paramsAssembly(catechumenId, titleMass, api);
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presenças [getAll]");
	}

	const data = await response.json();

	if (!useParams) {
		AppStore.setPresences(data);
		sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
	}

	return data;
}

function verifyRequestUseParams(catechumenId, titleMass) {
	if (catechumenId !== undefined || titleMass !== undefined) {
		clearCache();
		return true;
	}

	return false;
}

function paramsAssembly(catechumenId, titleMass, api) {
	let params = new Map();

	if (catechumenId !== undefined) params.set('catechumenId', catechumenId);
	if (titleMass !== undefined) params.set('titleMass', titleMass);

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

async function getById(id) {
	const URL = `${api}/${id}`;
	const response = await fetch(URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presença [getById]");
	}

	return await response.json();
}

async function create(presence) {
	const response = await fetch(api, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(presence)
	});

	if (response.status === 409) {
		throw new Exceptions.ConflictWhenSavingInTheDatabaseException('Conflit in the saved database this Presences.');
	}

	if (!response.ok) {
		throw new Error("Erro ao salvar presença [create]");
	}

	return await response.json();
}

async function update(presence) {
	const response = await fetch(api, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(presence)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar presença [update]");
	}

	return await response.json();
}

async function deletePresence(id) {
	const URL = `${api}/${id}`;
	const response = await fetch(URL, {
		'method': 'DELETE'
	});

	if (!response.ok) {
		throw new Error("Erro ao deleter missa [delete]");
	}

	return response.status;
}

export const PresenceService = {
	getAll,
	getById,
	create,
	update,
	deletePresenca: deletePresence,
	clearCache,
};