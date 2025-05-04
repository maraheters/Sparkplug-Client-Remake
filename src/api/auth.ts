import { apiFetch } from "@/api/api";

export const API_URL = "/auth";

export type UserAuth = {
	id: number;
	username: string;
	email: string;
	phoneNumber: string;
	authorities: Role[];
	token: string;
};

export type AuthResponse = {
	token: string;
}

export enum Role {
	CLIENT_BASIC = "CLIENT_BASIC",
	CLIENT_PLUS = "CLIENT_PLUS",
	ADMIN_BASIC = "ADMIN_BASIC",
	ADMIN_MANAGER = "ADMIN_MANAGER",
	ADMIN_GOD = "ADMIN_GOD",
}

export const login = (username: string, password: string): Promise<AuthResponse> =>
	apiFetch(`${API_URL}/login`, {
		method: "POST",
		body: JSON.stringify({ username, password }),
	});

export const registerEmail = (
	username: string,
	email: string,
	password: string
): Promise<AuthResponse> =>
	apiFetch(`${API_URL}/register/email`, {
		method: "POST",
		body: JSON.stringify({ username, email, password }),
	});

export const registerPhoneNumber = (
	username: string,
	phoneNumber: string,
	password: string
): Promise<AuthResponse> =>
	apiFetch(`${API_URL}/register/phone-number`, {
		method: "POST",
		body: JSON.stringify({ username, phoneNumber, password }),
	});
