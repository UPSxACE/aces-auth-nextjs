export default class IllegalClientStateError extends Error {
	constructor(message: string = `Invalid client state`) {
		super(message);
	}
}
