import { http2 } from "./http";

export default function logout() {
	http2.post("/auth/logout");
}
