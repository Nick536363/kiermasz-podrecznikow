/**
 * module name:
 *  + auth.api.ts
 *
 * description:
 *  + Defines API user functions.
 */

import { apiFetch } from "./client";
import type {
	User,
	CreateUserInput,
	UpdateUserInput,
	ListUsersParams,
	PaginatedUsers,
} from "@/types/api";

export function getMe() {
	return apiFetch<User>("/users/me");
}

export function updateMe(data: UpdateUserInput) {
	return apiFetch<User>("/users/me", {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export function listUsers(params: ListUsersParams = {}) {
	const query = new URLSearchParams();

	if (params.page !== undefined) {
		query.set("page", String(params.page));
	}

	if (params.limit !== undefined) {
		query.set("limit", String(params.limit));
	}

	return apiFetch<PaginatedUsers>(`/users?${query.toString()}`);
}

export function getUser(id: number) {
	return apiFetch<User>(`/users/${id}`);
}

export function createUser(data: CreateUserInput) {
	return apiFetch<User>("/users", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export function updateUser(id: number, data: UpdateUserInput) {
	return apiFetch<User>(`/users/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export function deleteUser(id: number) {
	return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}
