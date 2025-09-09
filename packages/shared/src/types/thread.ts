import { ThreadSchema } from "../schemas/thread";
import { z } from "zod";

export type ThreadType = z.infer<typeof ThreadSchema>;
