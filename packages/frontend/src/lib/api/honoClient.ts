import type { AppType } from "@kotobad/backend/src/";
import { hc } from "hono/client";

// 型情報だけを参照するためダミーのエンドポイントを指定
export const client = hc<AppType>("https://placeholder.local");
