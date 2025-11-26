import GoogleOAuth from "@/components/feature/auth/googleOAuth";

export default function app() {
	return (
		<div className="flex flex-col items-center justify-center">
			<GoogleOAuth />
		</div>
	);
}
