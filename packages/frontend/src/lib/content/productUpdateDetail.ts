import { readFile } from "node:fs/promises";
import path from "node:path";

const PRODUCT_UPDATE_DETAIL_DIR_CANDIDATES = [
	path.join(process.cwd(), "src/content/product-updates"),
	path.join(process.cwd(), "packages/frontend/src/content/product-updates"),
];

export const getProductUpdateDetailMarkdown = async (slug: string) => {
	for (const directory of PRODUCT_UPDATE_DETAIL_DIR_CANDIDATES) {
		const filePath = path.join(directory, `${slug}.md`);

		try {
			return await readFile(filePath, "utf8");
		} catch (error) {
			if (
				error instanceof Error &&
				"code" in error &&
				error.code === "ENOENT"
			) {
				continue;
			}

			throw error;
		}
	}

	return null;
};
