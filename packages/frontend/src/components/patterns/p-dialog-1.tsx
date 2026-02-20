import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Pattern() {
	return (
		<div className="flex items-center justify-center">
			<Dialog>
				<form>
					<DialogTrigger asChild>
						<Button variant="outline">Basic Dialog</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit profile</DialogTitle>
							<DialogDescription>
								Make changes to your profile here. Click save when you&apos;re
								done. Your profile will be updated immediately.
							</DialogDescription>
						</DialogHeader>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name-1">Name</FieldLabel>
								<Input id="name-1" name="name" defaultValue="Pedro Duarte" />
							</Field>
							<Field>
								<FieldLabel htmlFor="username-1">Username</FieldLabel>
								<Input
									id="username-1"
									name="username"
									defaultValue="@peduarte"
								/>
							</Field>
						</FieldGroup>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</form>
			</Dialog>
		</div>
	);
}
