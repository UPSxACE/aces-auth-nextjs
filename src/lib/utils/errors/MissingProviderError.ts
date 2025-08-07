export default class MissingProviderError extends Error {
	// biome-ignore lint/complexity/noBannedTypes: it makes sense to use the type Function here
	constructor(hook: Function, provider: Function) {
		super(`${hook.name} must be used within a ${provider.name}`);
		this.name = "MissingProvider";
	}
}
