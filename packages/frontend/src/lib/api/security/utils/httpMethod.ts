const UNSAFE_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export const isUnsafeMethod = (method?: string) =>
	UNSAFE_METHODS.has((method ?? "GET").toUpperCase());
