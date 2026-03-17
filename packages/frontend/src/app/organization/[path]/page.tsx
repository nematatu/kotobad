import "@daveyplate/better-auth-ui/css";
import { OrganizationView } from "@daveyplate/better-auth-ui";
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server";
import AuthUIRouteProvider from "@/components/feature/auth/AuthUIRouteProvider";

export const dynamicParams = false;

type OrganizationPath =
	(typeof organizationViewPaths)[keyof typeof organizationViewPaths];

export function generateStaticParams() {
	return Object.values(organizationViewPaths).map((path) => ({ path }));
}

export default async function OrganizationPathPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	const { path } = await params;

	return (
		<AuthUIRouteProvider>
			<main className="container p-4 md:p-6">
				<OrganizationView path={path as OrganizationPath} />
			</main>
		</AuthUIRouteProvider>
	);
}
