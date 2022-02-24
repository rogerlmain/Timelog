import { empty } from "types/constants";


export const days_labour = 8;


export const formats = {
	hours: "HH:mm",
	time: "H:mm ap",
	compact: "MM/dd/yyyy H:mm ap"
}// formats;


export default class TimeTool {

	static formats = formats;

	static format (date_string, selected_format) {

		let date = (date_string instanceof Date) ? date_string : new Date (date_string);
		let hours = date.getHours ();

		return selected_format.
			replace ("yyyy", date.getFullYear ().toString ()).
			replace ("MM", date.getMonth ().toString()).
			replace ("dd", date.getDate ().toString ()).
			replace ("HH", hours.toString ()).
			replace ("H", ((hours > 12) ? hours - 12 : hours).toString ()).
			replace ("mm", date.getMinutes ().toString ().padded (2, "0")).
			replace ("ap", (hours < 12) ? "am" : "pm");

	}// format;


	static elapsed (elapsed_time) {

		let tmins = Math.floor (elapsed_time / 60000);

		let days = Math.floor (tmins / 1440);
		let hours = Math.floor ((tmins - (days * 1440)) / 60);
		let minutes = tmins - ((days * 1440) + (hours * 60));
			
		return `${((days > 0) ? `${days}:` : empty)}${((days > 0) ? hours.padded (2) : hours)}:${minutes.padded (2)}`;

	}// elapsed;


	static same_day (date_one, date_two) {
		if (date_one.getDate () != date_two.getDate ()) return false;
		if (date_one.getMonth () != date_two.getMonth ()) return false;
		if (date_one.getFullYear () != date_two.getFullYear ()) return false;
		return true;
	}// same_day;


}// TimeTool;