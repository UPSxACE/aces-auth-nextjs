import http from "@/lib/session/http";
import type {
	App,
	Connection,
	CreateAppResponse,
	GetAppsResponse,
	PublicAppInfo,
	ResetSecretResponse,
	WriteAppBody,
} from "./types";

const api = {
	createApp: async (reqBody: WriteAppBody) =>
		http.post<CreateAppResponse>("/apps", reqBody),
	getApp: async (appId: string) => http.get<App>(`/apps/${appId}`),
	getApps: async () => http.get<GetAppsResponse>("/apps"),
	updateApp: async ({ id, ...reqBody }: { id: string } & WriteAppBody) =>
		http.put<App>(`/apps/${id}`, reqBody),
	deleteApp: async (appId: string) => http.delete(`/apps/${appId}`),
	resetSecret: async (appId: string) =>
		http.post<ResetSecretResponse>(`/apps/${appId}/reset-secret`),
	getAppInfo: async (clientId: string, checkScopes?: string[]) =>
		http.get<PublicAppInfo>(`/info/app`, {
			params: {
				client_id: clientId,
				check_scopes: checkScopes ? checkScopes.join(" ") : undefined,
			},
		}),
	getConnections: async () => http.get<Connection[]>(`/apps/connections`),
	removeConnection: async (client_id: string) =>
		http.delete(`/apps/connections`, {
			params: {
				client_id,
			},
		}),
};

export default api;
