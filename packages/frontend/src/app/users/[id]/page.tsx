import { notFound } from "next/navigation";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { UserProfileActivity } from "./components/UserProfileActivity";
import { UserProfileEditor } from "./components/UserProfileEditor";
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
		return (
			<div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-5 sm:py-6">
				<UserProfileEditor profile={profile} />
				<UserProfileActivity profile={profile} />
			</div>
		);
	} catch (error) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			return notFound();
		}
		throw error;
	}
}
