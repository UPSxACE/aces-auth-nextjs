"use server";
import axios from "axios";
import { headers } from "next/headers";
import { cache } from "react";

type Session = {
	id: number;
	role: string;
	counter: number;
} | null;

/**
 * FIXME: USE THIS TO PROTECT PRIVATE ROUTES SERVERSIDE!!
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const getSession: () => Promise<Session> = cache(async () => {
	if (!BACKEND_URL) {
		throw new Error("Missing environment variable: NEXT_PUBLIC_BACKEND_URL");
	}

	const headersStore = await headers();

	console.log(headersStore.get("cookie"));

	const res = await axios
		.get(`${BACKEND_URL}/auth/session`, {
			headers: {
				cookie: headersStore.get("cookie"),
			},
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	console.log("FETCH!", res?.data);

	return {
		id: 1,
		role: "admin",
		counter: 0,
	};
});

export default getSession;
