import "@daveyplate/better-auth-ui/css";
import { AuthView } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import AuthUIRouteProvider from "@/components/feature/auth/AuthUIRouteProvider";

export const dynamicParams = false;

type AuthPath = (typeof authViewPaths)[keyof typeof authViewPaths];

export function generateStaticParams() {
	return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPathPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	const { path } = await params;

	return (
		<AuthUIRouteProvider>
			<main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
				<AuthView path={path as AuthPath} />
			</main>
		</AuthUIRouteProvider>
	);
}
