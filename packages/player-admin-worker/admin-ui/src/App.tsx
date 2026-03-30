import { useCallback, useEffect, useState } from "react";
import { CreatePlayerForm } from "./components/CreatePlayerForm";
import { PlayerTable } from "./components/PlayerTable";
import { StatusMessage } from "./components/StatusMessage";
import { TokenControls } from "./components/TokenControls";
import { createPlayer, fetchPlayers, updatePlayer } from "./lib/api";
import type { Player, PlayerPayload } from "./types";

export const App = () => {
	const [token, setToken] = useState("");
	const [players, setPlayers] = useState<Player[]>([]);
	const [status, setStatus] = useState("初期化中...");
	const [limit, setLimit] = useState(100);

	const loadPlayers = useCallback(async () => {
		if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
			setStatus("取得件数は 1-200 で指定してください");
			return;
		}

		setStatus("読み込み中...");
		try {
			const rows = await fetchPlayers(token, limit);
			setPlayers(rows);
			setStatus(`読み込み完了: ${rows.length} 件`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setStatus(`読み込み失敗: ${message}`);
		}
	}, [limit, token]);

	const handleCreate = async (payload: PlayerPayload) => {
		setStatus("追加中...");
		try {
			await createPlayer(token, payload);
			setStatus("追加しました");
			await loadPlayers();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setStatus(`追加失敗: ${message}`);
			throw error;
		}
	};

	const handleSave = async (id: number, payload: PlayerPayload) => {
		setStatus(`更新中: id=${id}`);
		try {
			await updatePlayer(token, id, payload);
			setStatus(`更新しました: id=${id}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setStatus(`更新失敗: id=${id} / ${message}`);
			throw error;
		}
	};

	useEffect(() => {
		void loadPlayers();
	}, [loadPlayers]);

	return (
		<main className="container">
			<h1>選手情報 管理UI</h1>
			<p className="small">
				追加・編集はこの画面で直接実行できます（APIは <code>/players</code>{" "}
				を利用）。
			</p>
			<TokenControls
				token={token}
				limit={limit}
				onTokenChange={setToken}
				onLimitChange={setLimit}
				onReload={() => void loadPlayers()}
			/>
			<StatusMessage message={status} />
			<CreatePlayerForm onCreate={handleCreate} />
			<PlayerTable players={players} onSave={handleSave} />
		</main>
	);
};
