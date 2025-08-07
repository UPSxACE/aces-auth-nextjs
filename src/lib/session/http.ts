import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
	throw new Error("Missing environment variable: NEXT_PUBLIC_BACKEND_URL");
}

const http = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	timeout: 60000,
	withCredentials: true,
});

export const http2 = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	timeout: 60000,
	withCredentials: true,
});

export default http;
