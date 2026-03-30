type TokenControlsProps = {
	token: string;
	limit: number;
	onTokenChange: (value: string) => void;
	onLimitChange: (value: number) => void;
	onReload: () => void;
};

export const TokenControls = ({
	token,
	limit,
	onTokenChange,
	onLimitChange,
	onReload,
}: TokenControlsProps) => {
	return (
		<div className="card">
			<h2>認証 / 取得</h2>
			<div className="grid">
				<div>
					<label htmlFor="token">管理トークン（任意）</label>
					<input
						id="token"
						type="password"
						autoComplete="off"
						placeholder="Bearer不要。トークン文字列のみ"
						value={token}
						onChange={(event) => onTokenChange(event.target.value)}
					/>
					<p className="small">トークンはブラウザに保存しません。</p>
				</div>
				<div>
					<label htmlFor="limit">取得件数</label>
					<input
						id="limit"
						type="number"
						min={1}
						max={200}
						value={limit}
						onChange={(event) => onLimitChange(Number(event.target.value))}
					/>
				</div>
				<div className="control-end">
					<button type="button" className="secondary" onClick={onReload}>
						再読み込み
					</button>
				</div>
			</div>
		</div>
	);
};
