import { createAuth } from "../../../../auth";
import type { AppEnvironment } from "../../../../types";

type ViewerContext = {
	env: AppEnvironment["Bindings"];
	req: { raw: Request };
};

export async function resolveViewerUserId(
	c: ViewerContext,
): Promise<string | null> {
	try {
		const auth = createAuth({ env: c.env, restRequest: c.req.raw });
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});
		return session?.user?.id ?? null;
	} catch {
		return null;
	}
}
