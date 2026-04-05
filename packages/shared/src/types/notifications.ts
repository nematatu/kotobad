import type { z } from "zod";
import type {
	NotificationListSchema,
	NotificationTypeSchema,
} from "../schemas/notifications";

export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationList = z.infer<typeof NotificationListSchema>;
