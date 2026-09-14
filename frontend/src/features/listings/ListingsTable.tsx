/**
 * module name:
 *  + ListingsTable.tsx
 *
 * description:
 *  + Defines listings table view.
 */

import { useState } from "react";
import { Link } from "react-router-dom";

import { useListings, useDeleteListing } from "./useListings";
import { ListingCard } from "./ListingCard";
import { useAuthStore } from "@/features/auth/authStore";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 6;

export function ListingsTable() {
	const [page, setPage] = useState(1);
	const user = useAuthStore((state) => state.user);
	const { data, isLoading, isError } = useListings({ page, limit: PAGE_SIZE });
	const deleteMutation = useDeleteListing();

	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

	function handleDelete(id: number) {
		if (
			window.confirm("Delete this listing? You can't reverse this operation.")
		) {
			deleteMutation.mutate(id);
		}
	}

	return (
		<div>
			<div className="flex items-center justify-between">
				<h1 className="font-serif text-2xl text-[#1F2A24]">Listings</h1>
				<Link
					to="/listings/new"
					className="rounded-md bg-[#1F2A24] px-4 py-2 text-sm font-medium text-[#F6F4EF] hover:bg-[#2A382F]"
				>
					Add listing
				</Link>
			</div>

			{isLoading && <p className="mt-8 text-sm text-[#5C5A4E]">Loading...</p>}

			{isError && (
				<p className="mt-8 text-sm text-[#A13D3D]">
					Could not load listings. Try refreshing the page.
				</p>
			)}

			{data && data.listings.length === 0 && (
				<p className="mt-8 text-sm text-[#5C5A4E]">
					No listings available, they will appear here once you add one.
				</p>
			)}

			{data && data.listings.length > 0 && (
				<>
					<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{data.listings.map((listing) => (
							<ListingCard
								key={listing.id}
								id={listing.id}
								name={listing.name}
								description={listing.description}
								seller={listing.seller}
								price={listing.price}
								originalPrice={listing.originalPrice}
								createdAt={listing.createdAt}
								canManage={
									user?.role === "ADMIN" || user?.id === listing.authorId
								}
								onDelete={handleDelete}
								isDeleting={
									deleteMutation.isPending &&
									deleteMutation.variables === listing.id
								}
							/>
						))}
					</div>

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
				</>
			)}
		</div>
	);
}
