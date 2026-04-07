import { AppStore } from "../store/appStore.js";

const BASE_URL = "https://spc-springboot-production.up.railway.app"; // "https://spc-springboot-production.up.railway.app";

const FIND_ALL_MISSAS_URL = `${BASE_URL}/api/missas/v1`;
const FIND_BY_ID_MISSA_URL = `${BASE_URL}/api/missas/v1/{missaId}`;
const FIND_BY_NAME_COMMUNITY_OR_PARISH_MISSAS_URL = `${BASE_URL}/api/missas/v1/find-by?communityOrParish={nameCmmunityOrParish}`;
const FIND_BY_OCCURRED_TO_THIS_TODAY_MISSAS_URL = `${BASE_URL}/api/missas/v1/findByOccurredToThisToday`;
const FIND_ALL_MASSES_DATES_BY_COMMUNITY_OR_PARISH_URL = `${BASE_URL}/api/missas/v1/find-by/masses-dates?communityOrParish={nameCmmunityOrParish}`;
const CREATE_MISSA_URL = `${BASE_URL}/api/missas/v1`;
const UPDATE_MISSA_URL = `${BASE_URL}/api/missas/v1`;
const DELETE_MISSA_URL = `${BASE_URL}/api/missas/v1/{missaId}`;

const CACHE_KEY = 'masses_cache';

function getFromCache() {
	const inMemory = AppStore.getMasses();
	if (inMemory) return inMemory;

	const cache = sessionStorage.getItem(CACHE_KEY);
	if (cache) {
		const parsed = JSON.parse(cache);
		AppStore.setMasses(parsed);
		return parsed;
	}
	
	return null;
}

function clearCache() {
	AppStore.setMasses(null);
	sessionStorage.removeItem(CACHE_KEY);
}

async function findAll() {
	const response = await fetch(FIND_ALL_MISSAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findAll]");
	}

	return await response.json();
}

async function findById(missaId) {
	const url = FIND_BY_ID_MISSA_URL.replace('{missaId}', missaId);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missa [findById]");
	}

	return await response.json();
}

async function findByNameCommunityOrParish(nameCmmunityOrParish) {
	const cached = getFromCache();
	if (cached) return cached;

	const url = FIND_BY_NAME_COMMUNITY_OR_PARISH_MISSAS_URL.replace('{nameCmmunityOrParish}', nameCmmunityOrParish);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findByNameCommunityOrParish]");
	}

	const data = await response.json();

	AppStore.setMasses(data);
	sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));

	return data;
}

async function findByOccurredToThisToday() {
	const response = await fetch(FIND_BY_OCCURRED_TO_THIS_TODAY_MISSAS_URL, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findByOccurredToThisToday]");
	}

	return await response.json();
}

async function findAllMassesDatesByCommunityOrParish(nameCmmunityOrParish) {
	const url = FIND_ALL_MASSES_DATES_BY_COMMUNITY_OR_PARISH_URL.replace('{nameCmmunityOrParish}', nameCmmunityOrParish);
	const response = await fetch(url, {
		'method': 'GET',
		'headers': {
			'Accept': 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error("Erro ao obter missas [findAllMassesDatesByCommunityOrParish]");
	}

	return await response.json();
}

async function create(missa) {
	const response = await fetch(CREATE_MISSA_URL, {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(missa)
	});

	if (!response.ok) {
		throw new Error("Erro ao salvar missa [create]");
	}

	return await response.json();
}

async function update(missa) {
	const response = await fetch(UPDATE_MISSA_URL, {
		'method': 'PUT',
		'headers': {
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(missa)
	});

	if (!response.ok) {
		throw new Error("Erro ao atualizar missa [update]");
	}

	return await response.json();
}

async function deleteMissa(missaId) {
	const url = DELETE_MISSA_URL.replace('{missaId}', missaId);
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

export const MassService = {
	findAllMissa: findAll,
	findByIdMissa: findById,
	findByNameCommunityOrParish: findByNameCommunityOrParish,
	findByOccurredToThisTodayMissa: findByOccurredToThisToday,
	findAllMassesDatesByCommunityOrParish: findAllMassesDatesByCommunityOrParish,
	createMissa: create,
	updateMissa: update,
	deleteMissa: deleteMissa,
	clearCache,
};