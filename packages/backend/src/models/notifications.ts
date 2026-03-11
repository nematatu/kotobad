import { BaseNotificationSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIPostListSchema =
	BaseNotificationSchema.NotificationListSchema.openapi(
		"NotificationListSchema",
	);

export const OpenAPIPostUnreadCountSchema =
	BaseNotificationSchema.NotificationUnreadCountSchema.openapi(
		"NotificationUnreadCountSchema",
	);

export const OpenAPIPostItemSchema =
	BaseNotificationSchema.NotificationItemSchema.openapi(
		"NotificationItemSchema",
	);
