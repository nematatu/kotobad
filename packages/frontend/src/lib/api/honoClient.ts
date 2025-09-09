import { hc } from "hono/client";
import { AppType } from "@b3s/backend/src/";

export const client = hc<AppType>(process.env.API_URL!);
