import { useUser } from "@/components/feature/provider/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
	const { user } = useUser();
	const fallbackText =
		user?.name?.trim().charAt(0) ?? user?.email?.trim().charAt(0) ?? "?";
	return (
		<Avatar className="h-8 w-8 bg-gray-400">
			{user?.image && <AvatarImage src={user.image} alt={user?.name ?? ""} />}
			<AvatarFallback className="bg-gray-400 text-[10px] font-bold text-white">
				{fallbackText.toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
};
