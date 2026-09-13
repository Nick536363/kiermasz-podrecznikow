/**
 * module name:
 *  + client.ts
 *
 * description:
 *  + Defines API fetch functions that add authorization.
 */

import { getAccessToken, setAccessToken } from "@/features/auth/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

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

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const token = getAccessToken();

	const doApiFetch = (authToken: string | null) =>
		fetch(`${BASE_URL}${path}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
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
