type BirthDateParts = {
	year: string;
	month: string;
	day: string;
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const normalizeNumber = (value: string, maxLength: number) =>
	value.replace(/\D/g, "").slice(0, maxLength);

export const sanitizeBirthYear = (value: string) => normalizeNumber(value, 4);
export const sanitizeBirthMonth = (value: string) => normalizeNumber(value, 2);
export const sanitizeBirthDay = (value: string) => normalizeNumber(value, 2);

export const splitBirthDateInput = (
	dateInput: string | null,
): BirthDateParts => {
	if (!dateInput) {
		return {
			year: "",
			month: "",
			day: "",
		};
	}
	const matched = dateInput.match(DATE_PATTERN);
	if (!matched) {
		return {
			year: "",
			month: "",
			day: "",
		};
	}
	return {
		year: matched[1],
		month: matched[2],
		day: matched[3],
	};
};

const isValidDate = (year: number, month: number, day: number) => {
	if (month < 1 || month > 12 || day < 1 || day > 31) {
		return false;
	}
	const date = new Date(Date.UTC(year, month - 1, day));
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() + 1 === month &&
		date.getUTCDate() === day
	);
};

export const buildBirthDateInput = (
	year: string,
	month: string,
	day: string,
): string | null => {
	if (year.length !== 4 || month.length !== 2 || day.length !== 2) {
		return null;
	}
	const yearNumber = Number.parseInt(year, 10);
	const monthNumber = Number.parseInt(month, 10);
	const dayNumber = Number.parseInt(day, 10);
	if (
		!Number.isInteger(yearNumber) ||
		!Number.isInteger(monthNumber) ||
		!Number.isInteger(dayNumber)
	) {
		return null;
	}
	if (!isValidDate(yearNumber, monthNumber, dayNumber)) {
		return null;
	}
	return `${year}-${month}-${day}`;
};
