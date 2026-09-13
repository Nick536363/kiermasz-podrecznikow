/**
 * module name:
 *  + api.ts
 *
 * description:
 *  + Defines API types.
 */

// AUTH
export type LoginInput = {
	name: string;
	password: string;
};

export type RegisterInput = {
	name: string;
	password: string;
};

export type AuthResponse = {
	accessToken: string;
};

// USER
export type Role = "USER" | "ADMIN";

export type User = {
	id: number;
	name: string;
	role: Role;
	createdAt: string; // Date serializuje się do ISO stringa w JSON
};

export type CreateUserInput = {
	name: string;
	password: string;
	role?: Role; // domyślnie 'USER' po stronie backendu
};

export type UpdateUserInput = {
	name?: string;
	password?: string;
};

export type ListUsersParams = {
	page?: number;
	limit?: number;
};

// LISTING
export type Listing = {
	id: number;
	name: string;
	description: string;
	seller: string;
	price: string;
	originalPrice: string;
	createdAt: string;
	updatedAt: string;
	authorId: number;
};

export type CreateListingInput = {
	name: string;
	description: string;
	seller: string;
	price: string;
	originalPrice: string;
};

export type UpdateListingInput = {
	name?: string;
	description?: string;
	seller?: string;
};

export type ListListingsParams = {
	page?: number;
	limit?: number;
	authorId?: number;
};

// SHARED
export type PaginatedResponse<T> = {
	page: number;
	limit: number;
	total: number;
};

export type PaginatedUsers = PaginatedResponse<User> & { users: User[] };
export type PaginatedListings = PaginatedResponse<Listing> & {
	listings: Listing[];
};

export type ApiError = {
	statusCode: number;
	error: string;
	message: string;
};
