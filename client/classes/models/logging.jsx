import Database from "classes/database";
import OptionsStorage from "client/classes/storage/options.storage";

import LoggingStorage from "classes/storage/logging.storage";

import { date_formats, date_rounding } from "classes/types/constants";
import { isset } from "classes/common";


export default class LoggingModel {


	static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.set ("action", "latest");
		return Database.fetch_row ("logging", parameters);
	}// fetch_latest_entry;


	static log (client_id, project_id, timestamp) {

		let parameters = new FormData ();
		parameters.set ("action", "logging");
		parameters.set ("client_id", isset (client_id) ? client_id.toString () : null);
		parameters.set ("project_id", isset (project_id) ? project_id.toString () : null);
		parameters.set ("time_stamp", timestamp.format (date_formats.database_timestamp));

		return Database.fetch_row ("logging", parameters);

	}// log;

	
}// LoggingModel;