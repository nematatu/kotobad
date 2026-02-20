import { AccountView } from "@daveyplate/better-auth-ui";
import { accountViewPaths } from "@daveyplate/better-auth-ui/server";

export const dynamicParams = false;

type AccountPath = (typeof accountViewPaths)[keyof typeof accountViewPaths];

export function generateStaticParams() {
	return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPathPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	const { path } = await params;

	return (
		<main className="container p-4 md:p-6">
			<AccountView path={path as AccountPath} />
		</main>
	);
}
