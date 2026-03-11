import type { z } from "zod";
import type {
	NotificationItemSchema,
	NotificationListSchema,
	NotificationTypeSchema,
	NotificationUnreadCountSchema,
} from "../schemas/notifications";

export type NotificationItem = z.infer<typeof NotificationItemSchema>;
export type NotificationUnreadCount = z.infer<
	typeof NotificationUnreadCountSchema
>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationList = z.infer<typeof NotificationListSchema>;
