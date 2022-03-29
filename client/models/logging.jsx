import Database from "classes/database";
import Options from "classes/storage/options";

import Logging from "classes/storage/logging";

import { date_formats } from "classes/types/constants";


export default class LoggingModel {


	static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.set ("action", "latest");
		return Database.fetch_row ("logging", parameters);
	}// fetch_latest_entry;


	static log (project_id) {

		let parameters = new FormData ();
		let time_stamp = new Date ();

		switch (Options.granularity ()) {
			case 1: time_stamp = Logging.logged_in () ? time_stamp.round_hours (date_rounding.down) : time_stamp.round_hours (date_rounding.up); break;
			case 2: time_stamp = time_stamp.round_minutes (15); break;
		}// switch;

		parameters.set ("action", "logging");
		parameters.set ("project_id", project_id.toString ());
		parameters.set ("time_stamp", time_stamp.format (date_formats.database_timestamp));

		return Database.fetch_row ("logging", parameters);

	}// log;

	
}// ProjectsModel;

