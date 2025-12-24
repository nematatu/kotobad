export default function getTagAssetsUrl(tagValue: string): string {
	const baseUrl = process.env.NEXT_PUBLIC_R2_ASSETS_URL!;
	if (!baseUrl) {
		throw new Error("NEXT_PUBLIC_R2_ASSETS_URL が設定されていません。");
	}

	const trimmed = baseUrl.replace(/\/+$/, "");

	const normalized = tagValue.replace(/^\/+/, "");

	const R2AssetsUrl = `${trimmed}/tags/${normalized}`;
	return R2AssetsUrl;
}
