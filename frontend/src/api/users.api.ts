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

/**
 * @returns Information about the user.
 */
export function getMe() {
	return apiFetch<User>("/users/me");
}

/**
 * @description Updates only currently logged in user.
 * @param {UpdateUserInput} data
 * @returns Updated user data
 */
export function updateMe(data: UpdateUserInput) {
	return apiFetch<User>("/users/me", {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * @description Only returns a list of users when the requesting user is an admin.
 * @param {ListUsersParams} params
 * @returns All users
 */
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

/**
 * @description Only returns user data when the requesting user is an admin.
 * @param {number} id
 * @returns User data
 */
export function getUser(id: number) {
	return apiFetch<User>(`/users/${id}`);
}

/**
 * @description Only creates a user when the requesting user is an admin.
 * @param {CreateUserInput} data
 * @returns User data
 */
export function createUser(data: CreateUserInput) {
	return apiFetch<User>("/users", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * @description Only updates user data when the requesting user is an admin.
 * @param {number} id
 * @param {UpdateUserInput} data
 * @returns User data
 */
export function updateUser(id: number, data: UpdateUserInput) {
	return apiFetch<User>(`/users/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * @description Only deletes user data when the requesting user is an admin.
 * @param {number} id
 * @returns Code 204
 */
export function deleteUser(id: number) {
	return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}
