import { useUser } from "@/components/feature/provider/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar() {
	const { user } = useUser();
	const fallbackText =
		user?.name?.trim().charAt(0) ?? user?.email?.trim().charAt(0) ?? "?";
	return (
		<Avatar className="h-7 w-7 sm:h-10 sm:w-10">
			{user?.image && (
				<AvatarImage className="object-cover" src={user.image} alt="" />
			)}
			<AvatarFallback className="bg-gray-400 text-[10px] font-bold text-white">
				{fallbackText.toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
