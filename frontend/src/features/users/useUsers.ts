/**
 * module name:
 *  + useUsers.ts
 *
 * description:
 *  + Defines user hooks.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	listUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from "@/api/users.api";
import type {
	ListUsersParams,
	CreateUserInput,
	UpdateUserInput,
} from "@/types/api";

const USERS_KEY = "users";

export function useUsers(params: ListUsersParams = {}) {
	return useQuery({
		queryKey: [USERS_KEY, params],
		queryFn: () => listUsers(params),
	});
}

export function useUser(id: number) {
	return useQuery({
		queryKey: [USERS_KEY, id],
		queryFn: () => getUser(id),
		enabled: Number.isFinite(id),
	});
}

export function useCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateUserInput) => createUser(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
		},
	});
}

export function useUpdateUser(id: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateUserInput) => updateUser(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
		},
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
		},
	});
}
