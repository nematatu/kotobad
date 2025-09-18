import { LabelListType } from "@b3s/shared/src/types/label";

export const groupLabels = (labels: LabelListType) => {
	return labels.reduce<Record<string, Record<string, LabelListType>>>(
		(acc, label) => {
			if (!acc[label.category]) acc[label.category] = {};
			if (!acc[label.category][label.subCategory])
				acc[label.category][label.subCategory] = [];
			acc[label.category][label.subCategory].push(label);
			return acc;
		},
		{},
	);
};
