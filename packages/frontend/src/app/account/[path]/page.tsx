import { redirect } from "next/navigation";

export default async function AccountPathPage({
	params,
}: {
	params: Promise<{ path: string }>;
}) {
	await params;
	redirect("/settings/profile");
}
