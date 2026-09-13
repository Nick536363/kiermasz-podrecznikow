/**
 * module name:
 *  + router.tsx
 *
 * description:
 *  + Defines protected and public routes.
 */

import { createBrowserRouter } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { LoginForm } from "@/features/auth/LoginForm";
import { ListingsTable } from "@/features/listings/ListingsTable";
import { ListingForm } from "@/features/listings/ListingForm";
import { UsersTable } from "@/features/users/UsersTable";

export const router = createBrowserRouter([
	// PUBLIC
	{
		element: <AuthLayout />,
		children: [{ path: "/login", element: <LoginForm /> }],
	},

	// USER
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <DashboardLayout />,
				children: [
					{ path: "/", element: <ListingsTable /> },
					{ path: "/listings/new", element: <ListingForm /> },
					{ path: "/listings/:id/edit", element: <ListingForm /> },
				],
			},
		],
	},

	// ONLY ADMIN
	{
		element: <ProtectedRoute requiredRole="ADMIN" />,
		children: [
			{
				element: <DashboardLayout />,
				children: [{ path: "/users", element: <UsersTable /> }],
			},
		],
	},

	// 404
	{ path: "*", element: <NotFoundPage /> },
]);

function NotFoundPage() {
	return (
		<div style={{ textAlign: "center", marginTop: "4rem" }}>
			<h1>404</h1>
			<p>Not found</p>
		</div>
	);
}
