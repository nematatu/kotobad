import { hc } from "hono/client";
import { AppType } from "@kotobad/backend/src/";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!);
