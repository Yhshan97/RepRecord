import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";
import CalendarHeader from "react-native-calendars/src/calendar/header";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";
import { GetDateString, StrToDateLocale, TodayInStrLocale } from "@/helpers/DateHelper";

export interface CalendarComponentProps {
	onDateChanged: (date: string) => void;
	onDateOutOfRange: (date: string) => void;
	minDate: string;
	maxDate: string;
	markedDates?: MarkedDates;
}

export default function WeekCalendarComponent({
	onDateChanged,
	onDateOutOfRange,
	minDate,
	maxDate,
	markedDates = {},
}: CalendarComponentProps) {
	const [selectedDate, setSelectedDate] = useState<string>(TodayInStrLocale());
	const minDateObj = StrToDateLocale(minDate);
	const maxDateObj = new Date(StrToDateLocale(maxDate).setHours(23, 59, 59));

	return (
		<CalendarProvider
			date={selectedDate}
			onDateChanged={(date) => {
				const dateObj = StrToDateLocale(date);
				if (dateObj <= minDateObj || dateObj >= maxDateObj) {
					onDateOutOfRange(date);
					return;
				}
				setSelectedDate(date);
				onDateChanged(date);
			}}
		>
			<CalendarHeader
				hideArrows
				hideDayNames
				style={{ backgroundColor: "white" }}
				customHeaderTitle={<Text style={styles.monthText}>{GetDateString(StrToDateLocale(selectedDate))}</Text>}
			/>
			<WeekCalendar
				firstDay={1}
				maxDate={maxDate}
				minDate={minDate}
				markedDates={markedDates}
				allowSelectionOutOfRange={false}
			/>
		</CalendarProvider>
	);
}

const styles = StyleSheet.create({
	monthText: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 10,
		fontWeight: "bold",
	},
});
