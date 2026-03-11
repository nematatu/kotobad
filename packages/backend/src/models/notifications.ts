import { BaseNotificationSchema } from "@kotobad/shared/src/schemas";

export const OpenAPINotificationListSchema =
	BaseNotificationSchema.NotificationListSchema.openapi(
		"NotificationListSchema",
	);

export const OpenAPINotificationUnreadCountSchema =
	BaseNotificationSchema.NotificationUnreadCountSchema.openapi(
		"NotificationUnreadCountSchema",
	);

export const OpenAPINotificationItemSchema =
	BaseNotificationSchema.NotificationItemSchema.openapi(
		"NotificationItemSchema",
	);

export const OpenAPINotificationReadAllResponseSchema =
	BaseNotificationSchema.NotificationReadAllResponseSchema.openapi(
		"NotificationReadAllResponseSchema",
	);
