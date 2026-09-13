/**
 * module name:
 *  + LoginForm.tsx
 *
 * description:
 *  + Login panel.
 */

import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth.api";
import { useAuth } from "@/features/auth/useAuth";

export function LoginForm() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const location = useLocation();
	const { completeAuth } = useAuth();

	const mutation = useMutation({
		mutationFn: () => login({ name, password }),
		onSuccess: ({ accessToken }) => {
			const from =
				(location.state as { from?: Location })?.from?.pathname ?? "/";
			completeAuth(accessToken, from);
		},
	});

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		mutation.mutate();
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6">
			<div>
				<h1 className="font-serif text-3xl text-[#1F2A24]">Login</h1>
			</div>

			<div className="flex flex-col gap-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">User name</span>
					<input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Password</span>
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>
			</div>

			{mutation.isError && (
				<p className="text-sm text-[#A13D3D]">
					Incorrect user password or name.
				</p>
			)}

			<button
				type="submit"
				disabled={mutation.isPending}
				className="rounded-md bg-[#1F2A24] px-4 py-2.5 text-sm font-medium text-[#F6F4EF] transition-colors hover:bg-[#2A382F] disabled:opacity-60"
			>
				{mutation.isPending ? "Logging in..." : "Login"}
			</button>
		</form>
	);
}
