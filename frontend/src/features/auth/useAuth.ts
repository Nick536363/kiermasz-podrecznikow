/**
 * module name:
 *  + useAuth.ts
 *
 * description:
 *  + Defines authorization hooks.
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { logout as logoutRequest } from "@/api/auth.api";
import { getMe } from "@/api/users.api";

export function useAuth() {
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitializing = useAuthStore((state) => state.isInitializing);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const setUser = useAuthStore((state) => state.setUser);
	const clearAuth = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	const completeAuth = useCallback(
		async (accessToken: string, redirectTo = "/") => {
			setAccessToken(accessToken);
			const me = await getMe();
			setUser(me);
			navigate(redirectTo, { replace: true });
		},
		[setAccessToken, setUser, navigate],
	);

	const logout = useCallback(async () => {
		await logoutRequest().catch(() => {});
		clearAuth();
		navigate("/login", { replace: true });
	}, [clearAuth, navigate]);

	return {
		user,
		isAuthenticated,
		isInitializing,
		isAdmin: user?.role === "ADMIN",
		completeAuth,
		logout,
	};
}
