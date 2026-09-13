/**
 * module name:
 *  + DashboardLayout.tsx
 *
 * description:
 *  + Defines dashboard's layout and style.
 */

import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";

const NAV_LINK_CLASS = "block rounded-md px-3 py-2 text-sm transition-colors";

function navLinkClassName({ isActive }: { isActive: boolean }) {
	return `${NAV_LINK_CLASS} ${
		isActive
			? "bg-[#F6F4EF] text-[#1F2A24]"
			: "text-[#C7C2B4] hover:bg-[#2A382F] hover:text-[#F6F4EF]"
	}`;
}

export function DashboardLayout() {
	const { user, logout, isAdmin } = useAuth();

	return (
		<div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)]">
			<aside className="flex flex-col justify-between bg-[#1F2A24] px-4 py-6">
				<div>
					<p className="px-3 font-serif text-lg text-[#F6F4EF]">Listapp</p>

					<nav className="mt-8 flex flex-col gap-1">
						<NavLink to="/" end className={navLinkClassName}>
							Listings
						</NavLink>
						{isAdmin && (
							<NavLink to="/users" className={navLinkClassName}>
								Users
							</NavLink>
						)}
					</nav>
				</div>

				<div className="border-t border-[#33403A] pt-4">
					<p className="px-3 text-xs text-[#8A8577]">
						Logged in as: <span className="text-[#C7C2B4]">{user?.name}</span>
					</p>
					<button
						type="button"
						onClick={logout}
						className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm text-[#C7C2B4] transition-colors hover:bg-[#2A382F] hover:text-[#F6F4EF]"
					>
						Logout
					</button>
				</div>
			</aside>

			<main className="bg-[#F6F4EF] px-8 py-8">
				<Outlet />
			</main>
		</div>
	);
}
