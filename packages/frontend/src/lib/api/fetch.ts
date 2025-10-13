type fetchArgs = Parameters<typeof fetch>;

export async function fetcher<T>(
	url: fetchArgs[0],
	args: fetchArgs[1] = {},
): Promise<T> {
	let init: RequestInit = args ?? {};

	// ブラウザで動いているときだけ cookie を送受信する
	if (typeof window !== "undefined") {
		init = {
			...init,
			credentials: init.credentials ?? "include",
		};
	}

	const res = await fetch(url, init);
	if (!res.ok || "error" in res) {
		let errorBody: any = null;
		try {
			errorBody = await res.json();
		} catch {
			errorBody = await res.text();
		}
		console.error("Fetch error:", res.status, errorBody);
		const error: any = new Error(`Fetch error: ${res.status}`);
		error.status = res.status;
		throw error;
	}
	return res.json() as Promise<T>;
}
