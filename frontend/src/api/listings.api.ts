/**
 * module name:
 *  + listings.api.ts
 *
 * description:
 *  + Defines API listing functions.
 */

import { apiFetch } from "./client";
import type {
	Listing,
	CreateListingInput,
	UpdateListingInput,
	ListListingsParams,
	PaginatedListings,
} from "@/types/api";

/**
 * @param {ListListingsParams} params
 * @returns User's lisitngs
 */
export function listMyListings(params: ListListingsParams = {}) {
	const query = new URLSearchParams();

	if (params.page !== undefined) {
		query.set("page", String(params.page));
	}

	if (params.limit !== undefined) {
		query.set("limit", String(params.limit));
	}

	return apiFetch<PaginatedListings>(`/listings/me?${query.toString()}`);
}

/**
 * @param {ListListingsParams} params
 * @returns All listings
 */
export function listListings(params: ListListingsParams = {}) {
	const query = new URLSearchParams();

	if (params.page !== undefined) {
		query.set("page", String(params.page));
	}

	if (params.limit !== undefined) {
		query.set("limit", String(params.limit));
	}

	if (params.authorId !== undefined) {
		query.set("authorId", String(params.authorId));
	}

	return apiFetch<PaginatedListings>(`/listings?${query.toString()}`);
}

/**
 * @param {number} id
 * @returns Requested listing
 */
export function getListing(id: number) {
	return apiFetch<Listing>(`/listings/${id}`);
}

/**
 * @param {CreateListingInput} data
 * @returns Created listing data
 */
export function createListing(data: CreateListingInput) {
	return apiFetch<Listing>("/listings", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * @param {number} id
 * @param {UpdateListingInput} data
 * @returns Updated listing data
 */
export function updateListing(id: number, data: UpdateListingInput) {
	return apiFetch<Listing>(`/listings/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

/**
 * @param {number} id
 * @returns Code 204
 */
export function deleteListing(id: number) {
	return apiFetch<void>(`/listings/${id}`, { method: "DELETE" });
}
