class ConflictWhenSavingInTheDatabaseException extends Error {
	constructor(message) {
		super(message);
		this.name = "ConflicWhenSavingInTheDatabaseException";
	};
}

class DataCouldNotBeRenderedException extends Error {
	constructor(message) {
		super(message);
		this.name = "DataCouldNotBeRenderedException";
	}
}

export const Exceptions = {
	ConflictWhenSavingInTheDatabaseException,
	DataCouldNotBeRenderedException,
};