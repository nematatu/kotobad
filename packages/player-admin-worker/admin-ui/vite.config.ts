import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	root: resolve(__dirname),
	build: {
		outDir: resolve(__dirname, "dist"),
		emptyOutDir: true,
	},
});
