export const API_URLS = {
	SIGN_UP:
		process.env.NODE_ENV === "production"
			? "https://cloudflare/"
			: "http://localhost:8787/auth/signup",
	LOGIN:
		process.env.NODE_ENV === "production"
			? "https://cloudflare/"
			: "http://localhost:8787/auth/login",
	LOGOUT:
		process.env.NODE_ENV === "production"
			? "https://cloudflare/"
			: "http://localhost:8787/auth/logout",
	ME:
		process.env.NODE_ENV === "production"
			? "https://cloudflare/"
			: "http://localhost:8787/auth/me",
	THREADS:
		process.env.NODE_ENV === "production"
			? "https://cloudflare/"
			: "http://localhost:8787/bbs/threads",
	CREATE_THREADS:
		process.env.NODE_ENV === "production"
			? "https://cloudflare/"
			: "http://localhost:8787/bbs/threads/create",
};
