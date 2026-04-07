import { AppStore } from "../store/appStore.js";

const BASE_URL = "http://localhost:8080"; // "https://spc-springboot-production.up.railway.app";

const FIND_ALL_PRESENCAS_URL = `${BASE_URL}/api/presencas/v1`;
const FIND_BY_ID_PRESENCA_URL = `${BASE_URL}/api/presencas/v1/{presencaId}`;
const FIND_BY_CATECHUMEN_ID_PRESENCA_URL = `${BASE_URL}/api/presencas/v1/findByCatechumenId/{catechumenId}`;
const CREATE_PRESENCA_URL = `${BASE_URL}/api/presencas/v1`;
const UPDATE_PRESENCA_URL = `${BASE_URL}/api/presencas/v1`;
const DELETE_PRESENCA_URL = `${BASE_URL}/api/presencas/v1/{presencaId}`;

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

async function findAll() {
	const cached = getFromCache();
	if (cached) return cached;

	const response = await fetch(FIND_ALL_PRESENCAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presenças [findAll]");
	}

	const data = await response.json();
	AppStore.setPresences(data);
	sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));

	return data;
}

async function findById(presencaId) {
	const url = FIND_BY_ID_PRESENCA_URL.replace('{presencaId}', presencaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presença [findById]");
	}

	return await response.json();
}

async function findByCatechumenId(catechumenId) {
	const url = FIND_BY_CATECHUMEN_ID_PRESENCA_URL.replace('{catechumenId}', catechumenId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter presença [findByCatechumenId]");
	}

	return await response.json();
}

async function create(presenca) {
	const response = await fetch(CREATE_PRESENCA_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(presenca)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar presença [create]");
	}

	return await response.json();
}

async function update(presenca) {
	const response = await fetch(UPDATE_PRESENCA_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(presenca)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar presença [update]");
	}

	return await response.json();
}

async function deletePresenca(presencaId) {
	const url = DELETE_PRESENCA_URL.replace('{presencaId}', presencaId);
	const response = await fetch(url, {
		'method': 'DELETE',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missa [findById]");
	}

	return response.status;
}

export const PresencaService = {
	findAllPresenca: findAll,
	findByIdPresenca: findById,
	findByCatechumenIdPresenca: findByCatechumenId,
	createPresenca: create,
	updatePresenca: update,
	deletePresenca: deletePresenca
};