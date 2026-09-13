/**
 * module name:
 *  + ListingForm.tsx
 *
 * description:
 *  + Defines listing editig/creating forms.
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateListing, useUpdateListing, useListing } from "./useListings";
import type { Listing } from "@/types/api";

type ListingFormFieldsProps = {
	listingId?: number;
	initialData?: Listing;
};

function ListingFormFields({ listingId, initialData }: ListingFormFieldsProps) {
	const isEditMode = listingId !== undefined;
	const navigate = useNavigate();

	const [name, setName] = useState(initialData?.name ?? "");
	const [description, setDescription] = useState(
		initialData?.description ?? "",
	);
	const [seller, setSeller] = useState(initialData?.seller ?? "");
	const [price, setPrice] = useState(initialData?.price ?? "0");
	const [originalPrice, setOriginalPrice] = useState(
		initialData?.originalPrice ?? "0",
	);

	const createMutation = useCreateListing();
	const updateMutation = useUpdateListing(listingId ?? NaN);
	const mutation = isEditMode ? updateMutation : createMutation;

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		mutation.mutate(
			{ name, description, seller, price, originalPrice },
			{ onSuccess: () => navigate("/", { replace: true }) },
		);
	}

	return (
		<div className="max-w-lg">
			<h1 className="font-serif text-2xl text-[#1F2A24]">
				{isEditMode ? "Edit listing" : "New Listing"}
			</h1>

			<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Title</span>
					<input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						minLength={2}
						maxLength={100}
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Description</span>
					<textarea
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						required
						minLength={2}
						maxLength={200}
						rows={4}
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Seller</span>
					<input
						type="text"
						value={seller}
						onChange={(event) => setSeller(event.target.value)}
						required
						minLength={2}
						maxLength={100}
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Price</span>
					<input
						type="number"
						value={originalPrice}
						onChange={(event) => setOriginalPrice(event.target.value)}
						required
						minLength={2}
						maxLength={100}
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm text-[#1F2A24]">Price after *Tax*</span>
					<input
						type="number"
						value={price}
						onChange={(event) => setPrice(event.target.value)}
						required
						minLength={2}
						maxLength={100}
						className="rounded-md border border-[#D8D4C6] bg-white px-3 py-2 text-sm text-[#1F2A24] outline-none focus:border-[#8C6A3F] focus:ring-1 focus:ring-[#8C6A3F]"
					/>
				</label>

				{mutation.isError && (
					<p className="text-sm text-[#A13D3D]">
						Could not save listing. Check all listing fields and try again.
					</p>
				)}

				<div className="mt-2 flex gap-3">
					<button
						type="submit"
						disabled={mutation.isPending}
						className="rounded-md bg-[#1F2A24] px-4 py-2.5 text-sm font-medium text-[#F6F4EF] hover:bg-[#2A382F] disabled:opacity-60"
					>
						{mutation.isPending
							? "Saving..."
							: isEditMode
								? "Save edits..."
								: "Add listing"}
					</button>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="rounded-md px-4 py-2.5 text-sm text-[#5C5A4E] hover:bg-[#EDEAE0]"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export function ListingForm() {
	const params = useParams<{ id?: string }>();
	const listingId = params.id ? Number(params.id) : undefined;
	const isEditMode = listingId !== undefined;

	const { data: existingListing, isLoading } = useListing(listingId ?? NaN);

	if (isEditMode && isLoading) {
		return <p className="text-sm text-[#5C5A4E]">Loading listings...</p>;
	}

	return (
		<ListingFormFields
			key={listingId ?? "new"}
			listingId={listingId}
			initialData={existingListing}
		/>
	);
}
