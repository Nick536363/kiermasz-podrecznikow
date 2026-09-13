/**
 * module name:
 *  + ListingCard.tsx
 *
 * description:
 *  + Defines listing card style and functions.
 */

import { Link } from "react-router-dom";

type ListingCardProps = {
	id: number;
	name: string;
	description: string;
	seller: string;
	price: string;
	originalPrice: string;
	createdAt: string;
	canManage: boolean;
	onDelete: (id: number) => void;
	isDeleting: boolean;
};

export function ListingCard({
	id,
	name,
	description,
	seller,
	price,
	originalPrice,
	createdAt,
	canManage,
	onDelete,
	isDeleting,
}: ListingCardProps) {
	return (
		<article className="flex flex-col gap-3 rounded-lg border border-[#E4E0D2] bg-white p-5">
			<div>
				<h3 className="font-serif text-lg text-[#1F2A24]">{name}</h3>
				<p className="mt-1 text-sm leading-relaxed text-[#5C5A4E]">
					{description}
				</p>
			</div>

			<p className="text-xs text-[#8A8577]">Sells: {seller}</p>

			<div>
				<p className="text-xs text-[#8A8577]">Current Price: {price}</p>
				<p className="text-xs text-[#8A8577]">
					Original Price: {originalPrice}
				</p>
			</div>

			<p className="text-xs text-[#8A8577]">Created at: {createdAt}</p>

			{canManage && (
				<div className="mt-1 flex gap-3 border-t border-[#EDEAE0] pt-3 text-sm">
					<Link
						to={`/listings/${id}/edit`}
						className="text-[#8C6A3F] hover:underline"
					>
						Edit
					</Link>
					<button
						type="button"
						onClick={() => onDelete(id)}
						disabled={isDeleting}
						className="text-[#A13D3D] hover:underline disabled:opacity-60"
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			)}
		</article>
	);
}
