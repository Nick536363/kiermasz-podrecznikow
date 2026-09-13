/**
 * module name:
 *  + auth.api.ts
 *
 * description:
 *  + Defines API authorization functions.
 */

import { apiFetch } from "./client";
import type { LoginInput, RegisterInput, AuthResponse } from "@/types/api";

export function login(data: LoginInput) {
	return apiFetch<AuthResponse>("/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export function register(data: RegisterInput) {
	return apiFetch<AuthResponse>("/auth/register", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

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

export function logout() {
	return apiFetch<void>("/auth/logout", { method: "POST" });
}
