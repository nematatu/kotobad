import { PRODUCT_UPDATE_DETAILS } from "@/content/product-updates/generated";

export const getProductUpdateDetailMarkdown = (slug: string) =>
	PRODUCT_UPDATE_DETAILS[slug as keyof typeof PRODUCT_UPDATE_DETAILS] ?? null;
