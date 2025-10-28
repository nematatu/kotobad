import type { AppType } from "@kotobad/backend/src/";
import { hc } from "hono/client";
import { getApiBaseUrl } from "../api/url/BaseUrl";

export const client = hc<AppType>(getApiBaseUrl());
