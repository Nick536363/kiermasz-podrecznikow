/**
 * module name:
 *  + client.ts
 *
 * description:
 *  + Defines API fetch functions that add authorization.
 */

import { getAccessToken, setAccessToken } from "@/features/auth/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * @description Asks server to refresh user's token and passes his credentials.
 * @returns Refreshed token
 */
async function refreshAccessToken(): Promise<string | null> {
	const result = await fetch(`${BASE_URL}/auth/refresh`, {
		method: "POST",
		credentials: "include",
	});

	if (!result) {
		return null;
	}

	const { accessToken } = await result.json();

	setAccessToken(accessToken);

	return accessToken;
}

/**
 * @description Wraper around requesting data from server, also adds an auth token (JWT).
 * @param {string} path Path to fetch
 * @param {RequestInit} options Request header
 * @returns Request response
 */
export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const token = getAccessToken();

	const doApiFetch = (authToken: string | null) =>
		fetch(`${BASE_URL}${path}`, {
			...options,
			headers: {
				...(options.body ? { "Content-Type": "application/json" } : {}),
				...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
				...options.headers,
			},
			credentials: "include",
		});

	let res = await doApiFetch(token);

	if (res.status === 401) {
		const newToken = await refreshAccessToken();

		if (newToken) {
			res = await doApiFetch(newToken);
		}
	}

	if (!res.ok) {
		const error = await res.json().catch(() => ({ message: res.statusText }));
		throw new Error(error.message ?? "Request failed");
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json();
}
