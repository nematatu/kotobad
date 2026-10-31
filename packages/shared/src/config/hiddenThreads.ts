/**
 * デモ用非表示スレッドID一覧
 *
 * デモ表示で見せたくないチャット／スレッドがある場合、この配列に対象のスレッドIDを追加してください。
 * 数値または文字列のどちらでも指定可能です。
 *
 * 例:
 * export const HIDDEN_THREAD_IDS: readonly (string | number)[] = [
 *   12,
 *   "34",
 * ];
 *
 * 後で元に戻す場合は、配列からIDを削除するか空配列 `[]` に戻してください。
 */
export const HIDDEN_THREAD_IDS: readonly (string | number)[] = [
	79, 80, 81, 82, 86, 87, 89, 104, 105, 106, 108, 109, 110, 111, 112, 113, 123,
	124, 125, 133, 134, 153, 154, 156, 162,
	177,
	// ここに非表示にしたいスレッドIDを追加
];

const ENV_HIDDEN_IDS =
	typeof process !== "undefined" && process.env?.HIDDEN_THREAD_IDS
		? process.env.HIDDEN_THREAD_IDS.split(",")
				.map((id) => id.trim())
				.filter(Boolean)
		: [];

/**
 * 指定されたスレッドIDが非表示対象（デモ用非表示）かどうかを判定します。
 */
export function isHiddenThreadId(
	threadId: string | number | null | undefined,
): boolean {
	if (threadId == null) return false;
	const idStr = String(threadId);

	if (HIDDEN_THREAD_IDS.some((id) => String(id) === idStr)) {
		return true;
	}

	if (ENV_HIDDEN_IDS.some((id) => id === idStr)) {
		return true;
	}

	return false;
}
