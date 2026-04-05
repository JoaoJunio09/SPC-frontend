export const AppStore = {
	catechumens: null,
	catechists: null,
	masses: null,
	steps: null,
	presences: null,

	setCatechumens(data) {
		this.catechumens = data;
	},

	getCatechumens() { 
		return this.catechumens;
	},

	setCatechists(data) {
		this.catechists = data;
	},

	getCatechists() { 
		return this.catechists;
	},

	setMasses(data) {
		this.masses = data;
	},

	getMasses() {
		return this.masses;
	},

	setSteps(data) {
		this.steps = data;
	},

	getSteps() {
		return this.steps;
	},

	setPresences(data) {
		this.presences = data;
	},

	getPresences() {
		return this.presences;
	},

	clear() {
		this.catechumens = null,
		this.catechists = null,
		this.masses = null,
		this.steps = null,
		this.presences = null
	}
}