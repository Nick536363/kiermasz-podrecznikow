/**
 * module name:
 *  + main.tsx
 *
 * description:
 *  + Defines *clean* entrypoint and refreshToken hook.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { useAuthStore } from "@/features/auth/authStore";
import { refreshAccessToken } from "@/api/auth.api";
import { getMe } from "@/api/users.api";

import "./css/index.css";

refreshAccessToken()
	.then(async (accessToken) => {
		if (!accessToken) {
			return;
		}

		useAuthStore.getState().setAccessToken(accessToken);

		const user = await getMe();
		useAuthStore.getState().setUser(user);
	})
	.catch(() => {
		// User not logged in
	})
	.finally(() => {
		useAuthStore.getState().finishInitializing();
	});

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element #root not found in index.html");
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
