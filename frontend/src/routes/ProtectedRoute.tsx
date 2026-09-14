/**
 * module name:
 *  + ProtectedRoute.tsx
 *
 * description:
 *  + Defines function that checks users authentication.
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/features/auth/authStore";
import type { Role } from "@/types/api";

type ProtectedRouteProps = {
	requiredRole?: Role;
};

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
	const { isAuthenticated, isInitializing, user } = useAuthStore();
	const location = useLocation();

	if (isInitializing) {
		return null; // or <FullPageSpinner />
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (requiredRole && user?.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
