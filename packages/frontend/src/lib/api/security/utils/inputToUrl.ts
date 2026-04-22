export const inputToUrl = (input: Parameters<typeof fetch>[0]): URL => {
	if (input instanceof URL) return input;
	if (typeof input === "string") return new URL(input);
	if (input instanceof Request) return new URL(input.url);
	throw new Error("Invalid input");
};
