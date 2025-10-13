import type { AppType } from "@kotobad/backend/src/";
import { hc } from "hono/client";
import { getApiBaseUrl } from "../config/apiUrls";

export const client = hc<AppType>(getApiBaseUrl());
