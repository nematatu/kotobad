import { DeveloperRoadmapListSchema } from "@kotobad/shared/src/schemas/developerRoadmap";

export const MOCK_DEVELOPER_ROADMAP_ITEMS = DeveloperRoadmapListSchema.parse([
	{
		id: 2000,
		title: "検索結果の情報密度",
		status: "wip",
		sortOrder: 0,
		createdAt: "2026-03-10T10:20:00.000Z",
		updatedAt: null,
	},
	{
		id: 2001,
		title: "ボヤキページの運用",
		status: "wip",
		sortOrder: 1,
		createdAt: "2026-03-10T09:10:00.000Z",
		updatedAt: null,
	},
	{
		id: 2002,
		title: "通知導線の見直し",
		status: "todo",
		sortOrder: 0,
		createdAt: "2026-03-09T18:00:00.000Z",
		updatedAt: null,
	},
	{
		id: 2003,
		title: "モバイル遷移の改善",
		status: "todo",
		sortOrder: 1,
		createdAt: "2026-03-09T17:50:00.000Z",
		updatedAt: null,
	},
	{
		id: 2004,
		title: "Markdown 詳細ページ",
		status: "done",
		sortOrder: 0,
		createdAt: "2026-03-09T15:10:00.000Z",
		updatedAt: "2026-03-09T16:00:00.000Z",
	},
	{
		id: 2005,
		title: "開発タイムライン",
		status: "done",
		sortOrder: 1,
		createdAt: "2026-03-09T13:00:00.000Z",
		updatedAt: null,
	},
]);
