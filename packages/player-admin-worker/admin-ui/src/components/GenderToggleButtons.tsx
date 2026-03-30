type GenderValue = "male" | "female" | null;

type GenderToggleButtonsProps = {
	value: GenderValue;
	onChange: (value: GenderValue) => void;
};

export const GenderToggleButtons = ({
	value,
	onChange,
}: GenderToggleButtonsProps) => {
	return (
		<div className="gender-toggle">
			<button
				type="button"
				className={`gender-toggle-btn gender-toggle-btn-male ${
					value === "male" ? "is-active" : ""
				}`}
				onClick={() => onChange("male")}
			>
				男
			</button>
			<button
				type="button"
				className={`gender-toggle-btn gender-toggle-btn-female ${
					value === "female" ? "is-active" : ""
				}`}
				onClick={() => onChange("female")}
			>
				女
			</button>
		</div>
	);
};
