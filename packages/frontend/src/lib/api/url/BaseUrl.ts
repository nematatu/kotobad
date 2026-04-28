const raw = process.env.NEXT_PUBLIC_API_URL;

if (!raw) {
	throw new Error("API_URLが設定されていません");
}

export const API_BASE_URL = raw;
