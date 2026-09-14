/**
 * module name:
 *  + useListings.ts
 *
 * description:
 *  + Defines listings hooks.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	listListings,
	listMyListings,
	getListing,
	createListing,
	updateListing,
	deleteListing,
} from "@/api/listings.api";
import type {
	ListListingsParams,
	CreateListingInput,
	UpdateListingInput,
} from "@/types/api";

const LISTINGS_KEY = "listings";

export function useListings(params: ListListingsParams = {}) {
	return useQuery({
		queryKey: [LISTINGS_KEY, params],
		queryFn: () => listListings(params),
	});
}

export function useMyListings(params: ListListingsParams = {}) {
	return useQuery({
		queryKey: [LISTINGS_KEY, "me", params],
		queryFn: () => listMyListings(params),
	});
}

export function useListing(id: number) {
	return useQuery({
		queryKey: [LISTINGS_KEY, id],
		queryFn: () => getListing(id),
		enabled: Number.isFinite(id),
	});
}

export function useCreateListing() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateListingInput) => createListing(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [LISTINGS_KEY] });
		},
	});
}

export function useUpdateListing(id: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateListingInput) => updateListing(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [LISTINGS_KEY] });
		},
	});
}

export function useDeleteListing() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteListing(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [LISTINGS_KEY] });
		},
	});
}
