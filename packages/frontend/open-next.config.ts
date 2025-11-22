import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
	// Uncomment to enable R2 cache,
	// It should be imported as:
	incrementalCache: r2IncrementalCache,
	queue: doQueue,
	tagCache: d1NextTagCache,
	enableCacheInterception: true,
});
