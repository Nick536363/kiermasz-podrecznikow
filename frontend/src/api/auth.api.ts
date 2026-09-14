/**
 * module name:
 *  + auth.api.ts
 *
 * description:
 *  + Defines API authorization functions.
 */

import { apiFetch } from "./client";
import type { LoginInput, AuthResponse } from "@/types/api";

/**
 * @description Asks server nicely to loing this user.
 * @param {LoginInput} data User name and password data
 * @returns Login response
 */
export function login(data: LoginInput) {
	return apiFetch<AuthResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * @description Asks server to refresh user's JWT.
 * @returns Refreshed token
 */
export async function refreshAccessToken(): Promise<string | null> {
	const baseUrl = import.meta.env.VITE_API_URL;

	const response = await fetch(`${baseUrl}/auth/refresh`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		return null;
	}

	const data: AuthResponse = await response.json();

	return data.accessToken;
}

/**
 * @description Asks server to logout user.
 * @returns Code 204
 */
export function logout() {
	return apiFetch<void>("/auth/logout", { method: "POST" });
}
