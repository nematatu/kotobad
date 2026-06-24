import { getRequiredEnv } from "../requiredEnv";

const R2_ASSETS_URL = getRequiredEnv("NEXT_PUBLIC_R2_ASSETS_URL");

export default function getTagAssetsUrl(tagValue: string): string {
	const trimmed = R2_ASSETS_URL.replace(/\/+$/, "");

	const normalized = tagValue.replace(/^\/+/, "");

	const R2AssetsUrl = `${trimmed}/tags/${normalized}`;
	return R2AssetsUrl;
}
