import { notFound } from "next/navigation";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { UserProfileView } from "./components/UserProfileView";
import { getUserProfileById } from "./lib/getUserProfileById";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
	const { id } = await params;
	const userId = id.trim();

	if (!userId) {
		return notFound();
	}

	try {
		const profile = await getUserProfileById(userId);
		return <UserProfileView profile={profile} />;
	} catch (error) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			return notFound();
		}
		throw error;
	}
}
