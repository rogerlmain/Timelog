import { isset, is_null, is_string } from "classes/common";
import { empty } from "types/constants";


const time_format = {

	hours: "HH:mm",
	time: "H:mm ap",

	full_date: "dd",

	compact: "MM/dd/yyyy H:mm ap"

}// time_format;


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export const days_labour = 8;


export default class TimeTool {

	static formats = time_format;


	static is_date = (candidate) => { return (candidate instanceof Date) }
	static not_date = (candidate) => { return !TimeTool.is_date (candidate) }

	static month_name = (month) => { return months [month] }


	static format (date_string, selected_format) {

		let date = (date_string instanceof Date) ? date_string : new Date (date_string);
		let hours = date.getHours ();
		let month = date.getMonth ();

		return selected_format.
			replace ("yyyy", date.getFullYear ().toString ()).
			replace ("MMMM", TimeTool.month_name (month)).
			replace ("MM", (month + 1).toString ()).
			replace ("dd", date.getDate ().toString ()).
			replace ("HH", hours.toString ()).
			replace ("H", ((hours > 12) ? hours - 12 : hours).toString ()).
			replace ("mm", date.getMinutes ().padded (2)).
			replace ("ap", (hours < 12) ? "am" : "pm").
			replace ("dw", weekdays [date.getDay ()]);

	}// format;


	static get_date (date_string) {
		return new Date (this.format (date_string, "yyyy-MM-dd"));
	}// get_date;
	

	static get_month (date) {
		return isset (date = this.validated (date)) ? date.getMonth () : null;
	}// get_month;


	static get_year (date) {
		return isset (date = this.validated (date)) ? date.getFullYear () : null;
	}// get_year;


	static elapsed (elapsed_time) {

		let tmins = Math.floor (elapsed_time / 60);

		let days = Math.floor (tmins / 1440);
		let hours = Math.floor ((tmins - (days * 1440)) / 60);
		let minutes = tmins - ((days * 1440) + (hours * 60));
			
		return `${((days > 0) ? `${days}:` : empty)}${((days > 0) ? hours.padded (2) : hours)}:${minutes.padded (2)}`;

	}// elapsed;


	static same_day (date_one, date_two) {

		date_one = TimeTool.validated (date_one);
		date_two = TimeTool.validated (date_two);

		if (is_null (date_one) || is_null (date_two)) return false;
		
		if (date_one.getDate () != date_two.getDate ()) return false;
		if (date_one.getMonth () != date_two.getMonth ()) return false;
		if (date_one.getFullYear () != date_two.getFullYear ()) return false;

		return true;

	}// same_day;


	static same_month (date_one, date_two) {

		date_one = TimeTool.validated (date_one);
		date_two = TimeTool.validated (date_two);

		if (date_one.getMonth () != date_two.getMonth ()) return false;
		if (date_one.getFullYear () != date_two.getFullYear ()) return false;

		return true;

	}// same_month;


	static same_year (date_one, date_two) {

		date_one = TimeTool.validated (date_one);
		date_two = TimeTool.validated (date_two);

		if (date_one.getFullYear () != date_two.getFullYear ()) return false;

		return true;

	}// same_year;


	static validated (date) {
		if (is_string (date)) date = new Date (date);
		return (TimeTool.is_date (date)) ? date : null;
	}// validated;


}// TimeTool;