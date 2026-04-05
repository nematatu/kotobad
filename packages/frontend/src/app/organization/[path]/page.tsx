import { redirect } from "next/navigation";

export default async function OrganizationPathPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	await params;
	redirect("/");
}
