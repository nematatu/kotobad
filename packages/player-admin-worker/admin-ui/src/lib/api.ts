import type {
	FetchPlayersResult,
	Player,
	PlayerPayload,
	PlayerUpdatePayload,
} from "../types";
import { optimizeImageForUpload } from "./imageOptimize";

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
			issues?: Array<{ path?: Array<string | number>; message?: string }>;
		};
		if (Array.isArray(json.issues) && json.issues.length > 0) {
			const firstIssue = json.issues[0];
			const path =
				Array.isArray(firstIssue?.path) && firstIssue.path.length > 0
					? `${firstIssue.path.join(".")}: `
					: "";
			const message =
				typeof firstIssue?.message === "string" && firstIssue.message.length > 0
					? firstIssue.message
					: "validation_error";
			return `${path}${message}`;
		}
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
	offset: number,
): Promise<FetchPlayersResult> => {
	const response = await fetch(`/players?limit=${limit}&offset=${offset}`, {
		headers: createHeaders(token, false),
	});
	if (!response.ok) {
		throw new Error(await parseApiError(response));
	}
	const json = (await response.json()) as {
		players?: Player[];
		pagination?: {
			limit?: number;
			offset?: number;
			count?: number;
			total?: number;
		};
	};
	const players = Array.isArray(json.players) ? json.players : [];
	return {
		players,
		pagination: {
			limit:
				typeof json.pagination?.limit === "number"
					? json.pagination.limit
					: limit,
			offset:
				typeof json.pagination?.offset === "number"
					? json.pagination.offset
					: offset,
			count:
				typeof json.pagination?.count === "number"
					? json.pagination.count
					: players.length,
			total:
				typeof json.pagination?.total === "number" ? json.pagination.total : 0,
		},
	};
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
	payload: PlayerUpdatePayload,
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

export const uploadPlayerImage = async (
	token: string,
	file: File,
): Promise<string> => {
	const optimizedFile = await optimizeImageForUpload(file).catch(() => file);
	const formData = new FormData();
	formData.set("file", optimizedFile);

	const response = await fetch("/players/upload-image", {
		method: "POST",
		headers: createHeaders(token, false),
		body: formData,
	});

	if (!response.ok) {
		throw new Error(await parseApiError(response));
	}

	const json = (await response.json()) as { imageUrl?: string };
	if (typeof json.imageUrl !== "string" || json.imageUrl.length === 0) {
		throw new Error("imageUrl がレスポンスに含まれていません");
	}
	return json.imageUrl;
};
