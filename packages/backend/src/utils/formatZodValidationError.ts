import type { ZodError } from "zod";

export const formatZodValidationError = (error: ZodError): string => {
	const firstIssue = error.issues[0];
	const issuePath = firstIssue?.path.join(".") || "root";
	const issueMessage = firstIssue?.message || "Invalid input";

	return `Invalid Input for ${issuePath}: ${issueMessage}`;
};
