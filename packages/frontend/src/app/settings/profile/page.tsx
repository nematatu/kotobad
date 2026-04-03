import { BetterAuthSessionResponseSchema } from "@kotobad/shared/src/auth/betterAuthSession";
import { redirect } from "next/navigation";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import { getUserProfileById } from "../../users/[id]/lib/getUserProfileById";
import { SettingsProfileScreen } from "./components/SettingsProfileScreen";

export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
	const sessionUrl = await getApiUrl("ME");
	let userId: string | null = null;

	try {
		const raw = await BffFetcher<unknown>(sessionUrl, {
			method: "GET",
			cache: "no-store",
		});
		const parsed = BetterAuthSessionResponseSchema.safeParse(raw);
		if (parsed.success) {
			userId = parsed.data.user.id;
		}
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status !== 401) {
			throw error;
		}
	}

	if (!userId) {
		redirect("/auth/sign-in");
	}

	const profile = await getUserProfileById(userId);

	return (
		<div className="min-h-screen w-full bg-white py-4 sm:py-6">
			<SettingsProfileScreen profile={profile} />
		</div>
	);
}
