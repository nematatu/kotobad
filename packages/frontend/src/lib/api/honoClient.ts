import { hc } from "hono/client";
import { AppType } from "@kotobad/backend/src/";
import { getApiBaseUrl } from "../config/apiUrls";

export const client = hc<AppType>(getApiBaseUrl());
