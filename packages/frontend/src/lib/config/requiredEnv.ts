type RequiredEnvKey =
	| "NEXT_PUBLIC_API_URL"
	| "NEXT_PUBLIC_FRONTEND_URL"
	| "NEXT_PUBLIC_R2_ASSETS_URL"
	| "INTERNAL_API_SECRET";

export const getRequiredEnv = (key: RequiredEnvKey): string => {
	let value: string | undefined;

	switch (key) {
		case "NEXT_PUBLIC_API_URL":
			value = process.env.NEXT_PUBLIC_API_URL;
			break;
		case "NEXT_PUBLIC_FRONTEND_URL":
			value = process.env.NEXT_PUBLIC_FRONTEND_URL;
			break;
		case "NEXT_PUBLIC_R2_ASSETS_URL":
			value = process.env.NEXT_PUBLIC_R2_ASSETS_URL;
			break;
		case "INTERNAL_API_SECRET":
			value = process.env.INTERNAL_API_SECRET;
			break;
	}

	if (!value) {
		throw new Error(`${key} が設定されていません。`);
	}

	return value;
};
