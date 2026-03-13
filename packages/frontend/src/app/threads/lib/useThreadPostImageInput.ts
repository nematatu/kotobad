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

export const useThreadPostImageInput = () => {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		return () => {
			revokeObjectUrl(imagePreviewUrl);
		};
	}, [imagePreviewUrl]);

	const clearImageSelectionAction = () => {
		revokeObjectUrl(imagePreviewUrl);
		setImagePreviewUrl(null);
		setImageFile(null);
	};

	const selectImageAction = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) {
			return;
		}

		const validation = validateThreadPostImageFile(file);
		if (!validation.ok) {
			toast.error(validation.message);
			return;
		}

		const previewUrl = URL.createObjectURL(file);
		clearImageSelectionAction();
		setImageFile(file);
		setImagePreviewUrl(previewUrl);
	};

	const openImageDialogAction = () => {
		imageInputRef.current?.click();
	};

	const uploadSelectedImageAction = async (
		target: UploadImageTargetType,
	): Promise<string | null> => {
		if (!imageFile) {
			return null;
		}
		return uploadThreadPostImage(imageFile, target);
	};

	return {
		imageFile,
		imagePreviewUrl,
		imageInputRef,
		selectImageAction,
		openImageDialogAction,
		clearImageSelectionAction,
		uploadSelectedImageAction,
	};
};
