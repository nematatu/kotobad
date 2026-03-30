import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const workspaceRoot = resolve(__dirname, "../../..");

export default defineConfig({
	plugins: [react()],
	root: resolve(__dirname),
	base: "./",
	resolve: {
		alias: {
			react: resolve(workspaceRoot, "node_modules/react"),
			"react-dom": resolve(workspaceRoot, "node_modules/react-dom"),
			"react/jsx-runtime": resolve(
				workspaceRoot,
				"node_modules/react/jsx-runtime.js",
			),
			"react/jsx-dev-runtime": resolve(
				workspaceRoot,
				"node_modules/react/jsx-dev-runtime.js",
			),
		},
		dedupe: ["react", "react-dom"],
	},
	build: {
		outDir: resolve(__dirname, "dist"),
		emptyOutDir: true,
	},
});
