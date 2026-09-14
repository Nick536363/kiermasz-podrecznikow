/**
 * module name:
 *  + UsersTable.tsx
 *
 * description:
 *  + Defines users table view, only for admins.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

import { useUsers, useDeleteUser } from "./useUsers";
import { useAuthStore } from "@/features/auth/authStore";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 6;

export function UsersTable() {
	const [page, setPage] = useState(1);
	const currentUser = useAuthStore((state) => state.user);
	const { data, isLoading, isError } = useUsers({ page, limit: PAGE_SIZE });
	const deleteMutation = useDeleteUser();

	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	function handleDelete(id: number) {
		if (window.confirm("Delete this user? You can't reverse this operation.")) {
			deleteMutation.mutate(id);
		}
	}

	return (
		<div>
			<div className="flex items-center justify-between">
				<h1 className="font-serif text-2xl text-[#1F2A24]">Users</h1>
				<Link
					to="/users/new"
					className="rounded-md bg-[#1F2A24] px-4 py-2 text-sm font-medium text-[#F6F4EF] hover:bg-[#2A382F]"
				>
					Add user
				</Link>
			</div>

			{isLoading && <p className="mt-8 text-sm text-[#5C5A4E]">Loading...</p>}

			{isError && (
				<p className="mt-8 text-sm text-[#A13D3D]">
					Could not load users. Try refreshing the page.
				</p>
			)}

			{data && (
				<div className="mt-6 overflow-hidden rounded-lg border border-[#E4E0D2]">
					<table className="w-full text-left text-sm">
						<thead className="bg-[#EDEAE0] text-[#5C5A4E]">
							<tr>
								<th className="px-4 py-3 font-medium">Name</th>
								<th className="px-4 py-3 font-medium">Role</th>
								<th className="px-4 py-3 font-medium">Created at</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody>
							{data.users.map((user) => (
								<tr key={user.id} className="border-t border-[#EDEAE0]">
									<td className="px-4 py-3 text-[#1F2A24]">{user.name}</td>
									<td className="px-4 py-3 text-[#5C5A4E]">
										{user.role === "ADMIN" ? "Admin" : "User"}
									</td>
									<td className="px-4 py-3 text-[#5C5A4E]">
										{new Date(user.createdAt).toLocaleDateString("en-US")}
									</td>
									<td className="px-4 py-3 text-right">
										{user.id !== currentUser?.id && (
											<button
												type="button"
												onClick={() => handleDelete(user.id)}
												disabled={
													deleteMutation.isPending &&
													deleteMutation.variables === user.id
												}
												className="text-[#A13D3D] hover:underline disabled:opacity-60"
											>
												{deleteMutation.isPending &&
												deleteMutation.variables === user.id
													? "Deleting..."
													: "Delete"}
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Impossible to see, lol */}
			{data && data.users.length === 0 && (
				<p className="mt-8 text-sm text-[#5C5A4E]">No users...</p>
			)}

			{totalPages > 1 && (
				<div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#5C5A4E]">
					<Button
						type="button"
						onClick={() => setPage((current) => Math.max(1, current - 1))}
						disabled={page === 1}
						variant="ghost"
					>
						Previous
					</Button>
					<span>
						Page {page} of {totalPages}
					</span>
					<Button
						type="button"
						onClick={() =>
							setPage((current) => Math.min(totalPages, current + 1))
						}
						disabled={page === totalPages}
						variant="ghost"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
