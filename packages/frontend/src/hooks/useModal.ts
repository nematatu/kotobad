import { useState, useCallback } from "react";

export const useModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const setOpen = useCallback(() => setIsOpen(true), []);
	const setClose = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	return { isOpen, setIsOpen, setOpen, setClose, toggle };
};
