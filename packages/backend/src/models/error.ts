import { BaseErrorSchema } from "@kotobad/shared/src/schemas";

export const ErrorResponse =
	BaseErrorSchema.ErrorResponse.openapi("ErrorResponse");

export const SimpleErrorResponse = BaseErrorSchema.SimpleErrorResponse.openapi(
	"SimpleErrorResponse",
);
