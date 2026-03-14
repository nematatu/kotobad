"use client";

import type { UploadImageTargetType } from "@kotobad/shared/src/types/media";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	uploadThreadPostImage,
	validateThreadPostImageFile,
} from "./uploadImage";

const revokeObjectUrl = (value: string | null) => {
	if (!value?.startsWith("blob:")) {
		return;
	}
	URL.revokeObjectURL(value);
};

type UseThreadPostImageInputOptions = {
	maxImages: number;
};

export const useThreadPostImageInput = ({
	maxImages,
}: UseThreadPostImageInputOptions) => {
	const [imageFiles, setImageFiles] = useState<File[]>([]);
	const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		return () => {
			for (const previewUrl of imagePreviewUrls) {
				revokeObjectUrl(previewUrl);
			}
		};
	}, [imagePreviewUrls]);

	const clearImageSelectionAction = () => {
		for (const previewUrl of imagePreviewUrls) {
			revokeObjectUrl(previewUrl);
		}
		setImagePreviewUrls([]);
		setImageFiles([]);
	};

	const removeImageAtAction = (index: number) => {
		setImagePreviewUrls((current) => {
			const target = current[index];
			revokeObjectUrl(target ?? null);
			return current.filter((_, i) => i !== index);
		});
		setImageFiles((current) => current.filter((_, i) => i !== index));
	};

	const selectImageAction = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files ? Array.from(event.target.files) : [];
		event.target.value = "";
		if (files.length === 0) {
			return;
		}

		const availableSlots = Math.max(0, maxImages - imageFiles.length);
		if (availableSlots <= 0) {
			toast.error(`画像は最大${maxImages}枚までです`);
			return;
		}

		const nextFiles: File[] = [];
		const nextPreviewUrls: string[] = [];
		for (const file of files.slice(0, availableSlots)) {
			const validation = validateThreadPostImageFile(file);
			if (!validation.ok) {
				toast.error(validation.message);
				continue;
			}
			nextFiles.push(file);
			nextPreviewUrls.push(URL.createObjectURL(file));
		}

		if (nextFiles.length === 0) {
			return;
		}

		setImageFiles((current) => [...current, ...nextFiles].slice(0, maxImages));
		setImagePreviewUrls((current) =>
			[...current, ...nextPreviewUrls].slice(0, maxImages),
		);
	};

	const openImageDialogAction = () => {
		imageInputRef.current?.click();
	};

	const uploadSelectedImagesAction = async (
		target: UploadImageTargetType,
	): Promise<string[]> => {
		if (imageFiles.length === 0) {
			return [];
		}

		const uploadedUrls: string[] = [];
		for (const imageFile of imageFiles) {
			const uploadedUrl = await uploadThreadPostImage(imageFile, target);
			uploadedUrls.push(uploadedUrl);
		}
		return uploadedUrls;
	};

	return {
		imageFiles,
		imagePreviewUrls,
		maxImages,
		imageInputRef,
		selectImageAction,
		openImageDialogAction,
		clearImageSelectionAction,
		removeImageAtAction,
		uploadSelectedImagesAction,
	};
};
