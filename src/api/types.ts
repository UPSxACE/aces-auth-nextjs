export type App = {
	id: string;
	name: string;
	clientId: string;
	redirectUris: string[];
	homepageUrl: string;
	createdAt: string;
};

export type WriteAppBody = {
	name: string;
	homepageUrl: string;
	redirectUris: string[];
};

export type CreateAppResponse = App & {
	clientSecret: string;
};

export type GetAppsResponse = App[];

export type ResetSecretResponse = {
	clientSecret: string;
};

export type PublicAppInfo = {
	name: string;
	clientId: string;
	homepageUrl: string;
	authorized?: boolean;
};

export type Connection = {
	grantedAt: string;
	scopes: string[];
	app: {
		name: string;
		clientId: string;
	};
};
