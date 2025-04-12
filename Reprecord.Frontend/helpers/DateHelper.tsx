const DATE_IN_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

/** Date -> String (YYYY-MM-DD) */
export const DateToStrLocale = (date: Date): string => {
	return date.toLocaleDateString("en-CA");
};

/** Date (today) -> String (YYYY-MM-DD) */
export const TodayInStrLocale = (): string => {
	return new Date().toLocaleDateString("en-CA");
};

/** String (YYYY-MM-DD) -> Date */
export const StrToDateLocale = (dateStr: string): Date => {
	return new Date(dateStr);
};

/** Date -> locale string short "Month, year" */
export const GetDateString = (date: Date): string => {
	return date.toLocaleString("default", { month: "long", year: "numeric" });
};

/** Date (today) -> Date (today + days) */
export const GetDateOffsetFromNow = (days: number): Date => {
	const today = new Date().getTime();
	return new Date(today + days * DATE_IN_MS);
};
