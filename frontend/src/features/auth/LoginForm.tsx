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

import { Input } from "@/components/ui/Input";
import { login } from "@/api/auth.api";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/Button";

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
					<Input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Password</span>
					<Input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>
				</label>
			</div>

			{mutation.isError && (
				<p className="text-sm text-[#A13D3D]">
					Incorrect user password or name.
				</p>
			)}

			<Button type="submit" disabled={mutation.isPending}>
				{mutation.isPending ? "Logging in..." : "Login"}
			</Button>
		</form>
	);
}
