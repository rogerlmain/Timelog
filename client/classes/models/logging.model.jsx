import Database from "classes/database";

import { blank, date_formats } from "classes/types/constants";
import { isset } from "classes/common";


const table = "logging";


export default class LoggingModel {


	static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.set ("action", "latest");
		return Database.fetch_row (table, parameters);
	}// fetch_latest_entry;


	static bill (log_id, billed = true) {
		let parameters = new FormData ();
		parameters.set ("action", "billing");
		parameters.set ("log_id", log_id);
		parameters.set ("billed", billed);
		Database.save_data (table, parameters);
	}// bill;


	static log (client_id, project_id, notes, timestamp) {

		let parameters = new FormData ();
		
		parameters.set ("action", table);
		parameters.set ("client_id", isset (client_id) ? client_id.toString () : null);
		parameters.set ("project_id", isset (project_id) ? project_id.toString () : null);
		parameters.set ("notes", notes ?? blank);
		parameters.set ("billed", false);
		parameters.set ("time_stamp", timestamp.format (date_formats.database_timestamp));

		return Database.fetch_row (table, parameters);

	}// log;

}// LoggingModel;