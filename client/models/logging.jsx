import Database from "classes/database";
import OptionStorage from "classes/storage/option.storage";

import LogStorage from "classes/storage/log.storage";

import { date_formats, date_rounding } from "classes/types/constants";
import { isset } from "classes/common";


export default class LoggingModel {


	static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.set ("action", "latest");
		return Database.fetch_row ("logging", parameters);
	}// fetch_latest_entry;


	static log (company_id, client_id, project_id) {

		let parameters = new FormData ();
		let time_stamp = new Date ();

		switch (OptionStorage.granularity (company_id)) {
			case 1: time_stamp = LogStorage.logged_in () ? time_stamp.round_hours (date_rounding.down) : time_stamp.round_hours (date_rounding.up); break;
			case 2: time_stamp = time_stamp.round_minutes (15); break;
		}// switch;

		parameters.set ("action", "logging");
		parameters.set ("client_id", isset (client_id) ? client_id.toString () : null);
		parameters.set ("project_id", isset (project_id) ? project_id.toString () : null);
		parameters.set ("time_stamp", time_stamp.format (date_formats.database_timestamp));

		return Database.fetch_row ("logging", parameters);

	}// log;

	
}// LoggingModel;