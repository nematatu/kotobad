import type { Player, PlayerPayload } from "../types";

const createHeaders = (token: string, withJsonContentType = false) => {
	const headers: Record<string, string> = {};
	if (withJsonContentType) {
		headers["Content-Type"] = "application/json";
	}
	if (token.trim().length > 0) {
		headers.Authorization = `Bearer ${token.trim()}`;
	}
	return headers;
};

const parseApiError = async (response: Response): Promise<string> => {
	try {
		const json = (await response.json()) as {
			error?: string;
			message?: string;
		};
		if (typeof json.message === "string" && json.message.length > 0) {
			return json.message;
		}
		if (typeof json.error === "string" && json.error.length > 0) {
			return json.error;
		}
		return `HTTP ${response.status}`;
	} catch {
		return `HTTP ${response.status}`;
	}
};

export const fetchPlayers = async (
	token: string,
	limit: number,
): Promise<Player[]> => {
	const response = await fetch(`/players?limit=${limit}&offset=0`, {
		headers: createHeaders(token, false),
	});
	if (!response.ok) {
		throw new Error(await parseApiError(response));
	}
	const json = (await response.json()) as { players?: Player[] };
	return Array.isArray(json.players) ? json.players : [];
};

export const createPlayer = async (
	token: string,
	payload: PlayerPayload,
): Promise<void> => {
	const response = await fetch("/players", {
		method: "POST",
		headers: createHeaders(token, true),
		body: JSON.stringify(payload),
	});
	if (!response.ok) {
		throw new Error(await parseApiError(response));
	}
};

export const updatePlayer = async (
	token: string,
	id: number,
	payload: PlayerPayload,
): Promise<void> => {
	const response = await fetch(`/players/${id}`, {
		method: "PATCH",
		headers: createHeaders(token, true),
		body: JSON.stringify(payload),
	});
	if (!response.ok) {
		throw new Error(await parseApiError(response));
	}
};
