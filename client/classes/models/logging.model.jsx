import Database from "classes/database";
import OptionsStorage from "client/classes/storage/options.storage";

import LoggingStorage from "classes/storage/logging.storage";

import { blank, date_formats, date_rounding } from "classes/types/constants";
import { isset } from "classes/common";


const table_name = "logging";


export default class LoggingModel {


	static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.set ("action", "latest");
		return Database.fetch_row (table_name, parameters);
	}// fetch_latest_entry;


	static bill (log_id, billed = true) {
		let parameters = new FormData ();
		parameters.set ("action", "billing");
		parameters.set ("log_id", log_id);
		parameters.set ("billed", billed);
		Database.save_data (table_name, parameters);
	}// bill;


	static log (client_id, project_id, notes, timestamp) {

		let parameters = new FormData ();
		
		parameters.set ("action", table_name);
		parameters.set ("client_id", isset (client_id) ? client_id.toString () : null);
		parameters.set ("project_id", isset (project_id) ? project_id.toString () : null);
		parameters.set ("notes", notes ?? blank);
		parameters.set ("billed", false);
		parameters.set ("time_stamp", timestamp.format (date_formats.database_timestamp));

		return Database.fetch_row (table_name, parameters);

	}// log;

}// LoggingModel;