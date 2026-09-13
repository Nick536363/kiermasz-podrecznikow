/**
 * module name:
 *  + AuthLayout.tsx
 *
 * description:
 *  + Defines Auth's layout and style.
 */

import { Outlet } from "react-router-dom";

export function AuthLayout() {
	return (
		<div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
			<aside className="hidden flex-col justify-between bg-[#1F2A24] px-12 py-10 text-[#F6F4EF] md:flex">
				<div>
					<p className="font-serif text-2xl tracking-tight">Listapp</p>
				</div>

				<div className="max-w-sm">
					<p className="font-serif text-3xl leading-snug">
						Manage listings like never before.
					</p>
					<p className="mt-4 text-sm leading-relaxed text-[#C7C2B4]">
						Simple and readable UI with simple inner workings.
					</p>
				</div>

				<p className="text-xs text-[#8A8577]">
					Copyright © {new Date().getFullYear()} Listapp | All rights reserved.
				</p>
			</aside>

			<main className="flex items-center justify-center bg-[#F6F4EF] px-6 py-12">
				<div className="w-full max-w-sm">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
