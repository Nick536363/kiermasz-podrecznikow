/**
 * module name:
 *  + UserForm.tsx
 *
 * description:
 *  + Defines users form view, only for admins.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "./useUsers";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Role } from "@/types/api";

export function UserForm() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState<Role>("USER");
	const navigate = useNavigate();

	const mutation = useCreateUser();

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		mutation.mutate(
			{ name, password, role },
			{ onSuccess: () => navigate("/users", { replace: true }) },
		);
	}

	return (
		<div className="max-w-lg">
			<h1 className="font-serif text-2xl text-[#1F2A24]">New user</h1>

			<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">User name</span>
					<Input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						minLength={1}
						maxLength={100}
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Password</span>
					<Input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
						minLength={8}
						maxLength={100}
					/>
					<span className="text-xs text-[#8A8577]">Minimum 8 characters.</span>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Role</span>
					<select
						value={role}
						onChange={(event) => setRole(event.target.value as Role)}
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					>
						<option value="USER">User</option>
						<option value="ADMIN">Admin</option>
					</select>
				</label>

				{mutation.isError && (
					<p className="text-sm text-[#A13D3D]">
						Could not add user, check if user's name isn't taken.
					</p>
				)}

				<div className="mt-2 flex gap-3">
					<Button type="submit" disabled={mutation.isPending}>
						{mutation.isPending ? "Dodawanie…" : "Dodaj użytkownika"}
					</Button>
					<Button type="button" variant="ghost" onClick={() => navigate(-1)}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
