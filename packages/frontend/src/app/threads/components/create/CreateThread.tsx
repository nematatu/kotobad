import { ThreadSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";

type CreateThreadType = {
	title: string;
};

type TagOption = {
	id: number;
	name: string;
};

const initialTags: TagOption[] = [
	{ id: 1, name: "初心者" },
	{ id: 2, name: "試合" },
	{ id: 3, name: "ギア" },
	{ id: 4, name: "練習" },
	{ id: 5, name: "雑談" },
];

const getLabelClass = (labelId: number) =>
	CategoryColorMap[labelId % CategoryColorMap.length];

type CreateThreadFormProps = {
	onCreated: (newThread: ThreadType) => void;
};

export const CreateThreadForm = ({ onCreated }: CreateThreadFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const [tags, setTags] = useState<TagOption[]>(initialTags);
	const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
	const [newTagName, setNewTagName] = useState("");
	const form = useForm<CreateThreadType>({
		defaultValues: {
			title: "",
		},
	});

	const toggleTag = (id: number) => {
		setSelectedTagIds((prev) =>
			prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id],
		);
	};

	const addTag = () => {
		const trimmed = newTagName.trim();
		if (!trimmed) return;
		const existing = tags.find(
			(tag) => tag.name.toLowerCase() === trimmed.toLowerCase(),
		);
		if (existing) {
			setSelectedTagIds((prev) =>
				prev.includes(existing.id) ? prev : [...prev, existing.id],
			);
			setNewTagName("");
			return;
		}
		const nextId = tags.length ? Math.max(...tags.map((tag) => tag.id)) + 1 : 1;
		const nextTag = { id: nextId, name: trimmed };
		setTags((prev) => [...prev, nextTag]);
		setSelectedTagIds((prev) => [...prev, nextId]);
		setNewTagName("");
	};

	const handleSubmit = async (values: CreateThreadType) => {
		setError(null);
		try {
			const endpoint = await getBffApiUrl("CREATE_THREAD");
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const body = await response.json();

			if (!response.ok) {
				const message =
					typeof body === "object" && body && "error" in body
						? String(body.error)
						: "スレッド作成に失敗しました";
				throw new Error(message);
			}
			const thread = ThreadSchema.parse(body);
			const selectedTags = tags.filter((tag) =>
				selectedTagIds.includes(tag.id),
			);
			const threadWithTags = {
				...thread,
				threadLabels: selectedTags.map((tag) => ({
					threadId: thread.id,
					tagId: tag.id,
					tags: { id: tag.id, name: tag.name },
				})),
			};

			onCreated(threadWithTags);
			form.reset();
			setSelectedTagIds([]);
			setNewTagName("");
		} catch (error: unknown) {
			if (
				typeof error === "object" &&
				error !== null &&
				"status" in error &&
				typeof (error as { status?: unknown }).status === "number" &&
				(error as { status: number }).status === 401
			) {
				setError("ログインが必要です");
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
			}
		}
	};

	return (
		<Card className="my-4">
			<div className="w-[100%] p-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-3"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel className="text-md sm:text-xl">
										スレッドタイトル
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											{...form.register("title", {
												required: "タイトルは必須です",
												maxLength: {
													value: 80,
													message: "タイトルは80文字以内で入力してください",
												},
											})}
											placeholder="例: 〇〇の試合について"
											className="w-full sm:h-14 sm:w-1/3 outline-2 focus:border-blue-600 placeholder-gray-500/50"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && <p className="text-red-500">{error}</p>}

						<div className="space-y-2">
							<div className="font-bold">タグ</div>
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => {
									const isSelected = selectedTagIds.includes(tag.id);
									return (
										<button
											key={tag.id}
											type="button"
											onClick={() => toggleTag(tag.id)}
											className={cn(
												"rounded-full px-3 py-1 text-xs font-medium text-gray-800 transition",
												getLabelClass(tag.id),
												isSelected
													? "ring-2 ring-blue-500 ring-offset-1"
													: "opacity-70 hover:opacity-100",
											)}
										>
											{tag.name}
										</button>
									);
								})}
							</div>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<Input
									value={newTagName}
									onChange={(event) => setNewTagName(event.target.value)}
									placeholder="タグを追加"
									className="sm:w-64"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={addTag}
									disabled={!newTagName.trim()}
								>
									追加
								</Button>
							</div>
						</div>

						<Button
							className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
							type="submit"
						>
							新規スレッド作成
						</Button>
					</form>
				</Form>
			</div>
		</Card>
	);
};

type CreateThreadProps = {
	onCreated: (newThread: ThreadType) => void;
};

export const CreateThread = ({ onCreated }: CreateThreadProps) => {
	const [isOpenForm, setIsOpenForm] = useState(false);
	const handleToggleForm = () => {
		setIsOpenForm((prev) => !prev);
	};

	return (
		<div>
			<Button
				className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
				type="button"
				onClick={handleToggleForm}
			>
				{isOpenForm ? "▲" : "▼"} スレッド作成
			</Button>

			{isOpenForm && <CreateThreadForm onCreated={onCreated} />}
		</div>
	);
};
