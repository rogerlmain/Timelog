import { directions, empty, text_highlights } from "types/constants";


export const days_labour: number = 8;


export const formats = {
	compact: "MM/dd/yyyy H:mm ap"
}// formats;


export default class TimeFormatter {

	public static formats = formats;

	public static format (date_string: string, selected_format: string) {
		let date = new Date (date_string);
		let hours = date.getHours ();
		return selected_format.
			replace ("yyyy", date.getFullYear ().toString ()).
			replace ("MM", date.getMonth ().toString()).
			replace ("dd", date.getDate ().toString ()).
			replace ("H", ((hours > 12) ? hours - 12 : hours).toString ()).
			replace ("mm", date.getMinutes ().toString ().padded (2, "0")).
			replace ("ap", (hours < 12) ? "am" : "pm");
	}// format;


	public static elapsed (elapsed_time: number) {
		let days = Math.floor (elapsed_time / (60 * 60 * 24));
		let hours = Math.floor ((elapsed_time % (60 * 60 * 24)) / (60 * 60));
		let minutes = Math.round ((elapsed_time % (60 * 60)) / 60);
		return `${((days > 0) ? `${days}:` : empty)}${((days > 0) ? hours.padded (2) : hours)}:${minutes.padded (2)}`;
	}// elapsed;

}// timeFormat;