import { drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";
import type { Bindings } from "./types";

export const createDb = (env: Bindings) => drizzle(env.DB, { schema });

export type Database = ReturnType<typeof createDb>;
