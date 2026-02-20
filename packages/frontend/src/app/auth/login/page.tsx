import { redirect } from "next/navigation";

export default function AuthLoginPage() {
	redirect("/auth/sign-in");
}
