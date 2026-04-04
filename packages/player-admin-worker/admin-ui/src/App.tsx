import { useCallback, useEffect, useState } from "react";
import { CreatePlayerForm } from "./components/CreatePlayerForm";
import { PlayerTable } from "./components/PlayerTable";
import { StatusMessage } from "./components/StatusMessage";
import { TokenControls } from "./components/TokenControls";
import { createPlayer, fetchPlayers, updatePlayer } from "./lib/api";
import type { Player, PlayerPayload, PlayerUpdatePayload } from "./types";

export const App = () => {
	const [token, setToken] = useState("");
	const [players, setPlayers] = useState<Player[]>([]);
	const [status, setStatus] = useState("初期化中...");
	const [limit, setLimit] = useState(100);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const loadPlayers = useCallback(
		async (page: number) => {
			if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
				setStatus("取得件数は 1-200 で指定してください");
				return;
			}
			if (!Number.isInteger(page) || page < 1) {
				setStatus("ページ番号は 1 以上で指定してください");
				return;
			}
			const offset = (page - 1) * limit;

			setStatus("読み込み中...");
			try {
				const { players: rows, pagination } = await fetchPlayers(
					token,
					limit,
					offset,
				);
				const totalPages = Math.max(1, Math.ceil(pagination.total / limit));
				const normalizedPage = Math.min(page, totalPages);

				if (normalizedPage !== page) {
					setCurrentPage(normalizedPage);
					return;
				}

				setPlayers(rows);
				setTotalCount(pagination.total);
				setStatus(
					`読み込み完了: ${rows.length} 件（${normalizedPage}/${totalPages} ページ）`,
				);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				setStatus(`読み込み失敗: ${message}`);
			}
		},
		[limit, token],
	);

	const handleCreate = async (payload: PlayerPayload) => {
		setStatus("追加中...");
		try {
			await createPlayer(token, payload);
			setStatus("追加しました");
			setCurrentPage(1);
			await loadPlayers(1);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setStatus(`追加失敗: ${message}`);
			throw error;
		}
	};

	const handleSave = async (id: number, payload: PlayerUpdatePayload) => {
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
		void loadPlayers(currentPage);
	}, [currentPage, loadPlayers]);

	const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 1;
	const totalPages = Math.max(1, Math.ceil(totalCount / safeLimit));

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
				onTokenChange={(value) => {
					setToken(value);
					setCurrentPage(1);
				}}
				onLimitChange={(value) => {
					setLimit(value);
					setCurrentPage(1);
				}}
				onReload={() => void loadPlayers(currentPage)}
			/>
			<StatusMessage message={status} />
			<CreatePlayerForm token={token} onCreate={handleCreate} />
			<PlayerTable token={token} players={players} onSave={handleSave} />
			<div className="card pagination-panel">
				<p className="small">
					全 {totalCount} 件 / {currentPage} / {totalPages} ページ
				</p>
				<div className="pagination-row">
					<button
						type="button"
						className="ghost"
						onClick={() => {
							setCurrentPage((prev) => Math.max(1, prev - 1));
						}}
						disabled={currentPage <= 1}
					>
						前へ
					</button>
					<label htmlFor="page" className="page-input-wrap">
						ページ
						<input
							id="page"
							type="number"
							min={1}
							max={totalPages}
							value={currentPage}
							onChange={(event) => {
								const value = Number(event.target.value);
								if (!Number.isInteger(value)) return;
								const nextPage = Math.max(1, Math.min(totalPages, value));
								setCurrentPage(nextPage);
							}}
						/>
					</label>
					<button
						type="button"
						className="ghost"
						onClick={() => {
							setCurrentPage((prev) => Math.min(totalPages, prev + 1));
						}}
						disabled={currentPage >= totalPages}
					>
						次へ
					</button>
				</div>
			</div>
		</main>
	);
};
