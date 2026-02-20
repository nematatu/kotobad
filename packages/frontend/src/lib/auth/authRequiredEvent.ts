"use client";

export const AUTH_REQUIRED_EVENT = "kotobad:auth-required";

export const emitAuthRequiredEvent = () => {
	if (typeof window === "undefined") {
		return;
	}
	window.dispatchEvent(new CustomEvent(AUTH_REQUIRED_EVENT));
};
