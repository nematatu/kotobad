import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";
import { DEMO_STORAGE_KEY, isDemoModeActive, setDemoMode } from "./demoMode";

describe("demoMode", () => {
	const originalWindow = globalThis.window;

	beforeEach(() => {
		const storage = new Map<string, string>();
		const mockSessionStorage: Storage = {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, val: string) => {
				storage.set(key, String(val));
			},
			removeItem: (key: string) => {
				storage.delete(key);
			},
			clear: () => {
				storage.clear();
			},
			length: 0,
			key: () => null,
		};

		const mockLocation: Partial<Location> = {
			search: "",
			hostname: "kotobad.com",
			host: "kotobad.com",
			href: "https://kotobad.com",
			origin: "https://kotobad.com",
			pathname: "/",
			protocol: "https:",
		};

		const mockWindow: Partial<Window & typeof globalThis> = {
			location: mockLocation as Location,
			sessionStorage: mockSessionStorage,
			dispatchEvent: () => true,
			addEventListener: () => {},
			removeEventListener: () => {},
		};

		// Assign mock to globalThis
		globalThis.window = mockWindow as Window & typeof globalThis;
	});

	afterEach(() => {
		globalThis.window = originalWindow;
	});

	test("returns false by default for standard domain and empty query", () => {
		assert.equal(isDemoModeActive(), false);
	});

	test("returns true and persists to sessionStorage when ?demo=true is present", () => {
		window.location.search = "?demo=true";
		assert.equal(isDemoModeActive(), true);
		assert.equal(window.sessionStorage.getItem(DEMO_STORAGE_KEY), "true");
	});

	test("returns true when ?demo is present as boolean flag", () => {
		window.location.search = "?demo";
		assert.equal(isDemoModeActive(), true);
		assert.equal(window.sessionStorage.getItem(DEMO_STORAGE_KEY), "true");
	});

	test("clears storage and returns false when ?demo=false", () => {
		window.sessionStorage.setItem(DEMO_STORAGE_KEY, "true");
		window.location.search = "?demo=false";
		assert.equal(isDemoModeActive(), false);
		assert.equal(window.sessionStorage.getItem(DEMO_STORAGE_KEY), null);
	});

	test("returns true if hostname starts with demo.", () => {
		Object.defineProperty(window.location, "hostname", {
			value: "demo.kotobad.com",
			writable: true,
			configurable: true,
		});
		assert.equal(isDemoModeActive(), true);
	});

	test("setDemoMode persists enabled state to sessionStorage", () => {
		setDemoMode(true);
		assert.equal(window.sessionStorage.getItem(DEMO_STORAGE_KEY), "true");
		setDemoMode(false);
		assert.equal(window.sessionStorage.getItem(DEMO_STORAGE_KEY), null);
	});
});
