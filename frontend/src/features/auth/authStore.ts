/**
 * module name:
 *  + authStore.ts
 *
 * description:
 *  + Handles authorization token's state inside React.
 */

import { create } from "zustand";

import type { User } from "@/types/api";

type AuthState = {
	accessToken: string | null;
	user: User | null;
	isAuthenticated: boolean;
	isInitializing: boolean;
};

type AuthActions = {
	setAccessToken: (token: string | null) => void;
	setUser: (user: User | null) => void;
	finishInitializing: () => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
	accessToken: null,
	user: null,
	isAuthenticated: false,
	isInitializing: true,

	setAccessToken: (token) =>
		set({ accessToken: token, isAuthenticated: token !== null }),
	setUser: (user) => set({ user }),
	finishInitializing: () => set({ isInitializing: false }),
	logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));

export const getAccessToken = () => useAuthStore.getState().accessToken;
export const setAccessToken = (token: string | null) =>
	useAuthStore.getState().setAccessToken(token);
