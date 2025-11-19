CREATE INDEX IF NOT EXISTS "thread_created_at_idx" ON "threads" ("created_at");
CREATE INDEX IF NOT EXISTS "thread_label_idx" ON "threads" ("thread_id");
