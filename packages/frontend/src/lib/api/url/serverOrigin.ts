"use server";
import { ensureTrailingSlash } from "../../../utils/url/ensureTrailingSlash";

const { headers } = await import("next/headers");

export const getServerOrigin = async (): Promise<string | null> => {
	try {
		const hdrs = await headers();
		const host = hdrs.get("host");
		if (!host) return null;
		const forwardedProto = hdrs.get("x-forwarded-proto");
		const proto =
			forwardedProto ??
			(/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https");
		// bun run previewでローカルプレビューは出来ない！
		// 多分preview環境だとenvがproductionになって、protoがhttpsになってしまう
		// なので、http://locachost:3000/なのに、protoにhttpではなく、httpsになってしまう
		// bun devではenvがdevelopmentなのでprotoがhttpになるから、正常に動く
		// もしローカルプレビューをチェックしたいなら、一時的に${proto}をhttpにハードコードしてチェックできる
		const targetUrl = `${proto}://${host}`;
		return ensureTrailingSlash(targetUrl);
	} catch {
		return null;
	}
};
