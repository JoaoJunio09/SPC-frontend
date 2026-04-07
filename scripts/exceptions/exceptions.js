class ConflictWhenSavingInTheDatabaseException extends Error {
	constructor(message) {
		super(message);
		this.name = "ConflicWhenSavingInTheDatabaseException";
	};
}

export const Exceptions = {
	ConflictWhenSavingInTheDatabaseException,
};