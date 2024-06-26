import Database from "client/classes/database";

import { blank, date_formats } from "client/classes/types/constants";
import { isset } from "client/classes/common";
import CompanyStorage from "client/classes/storage/company.storage";
import AccountStorage from "../storage/account.storage";


const table = "logging";


export default class LoggingModel {


	static fetch_active_logs () {
		let parameters = new FormData ();
		parameters.set ("action", "active");
		parameters.set ("company_id", CompanyStorage.active_company_id ());
		return Database.fetch_data (table, parameters);
	}// fetch_active_logs;


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


	static get_latest_by_client (client_id) {

		let parameters = new FormData ();

		parameters.set ("action", "latest_by_client");
		parameters.set ("account_id", AccountStorage.account_id ());
		parameters.set ("client_id", client_id);

		return Database.fetch_row  (table, parameters);

	}/* get_latest_by_client */


	static get_latest_by_project (project_id) {

		let parameters = new FormData ();

		parameters.set ("action", "latest_by_project");
		parameters.set ("account_id", AccountStorage.account_id ());
		parameters.set ("project_id", project_id);

		return Database.fetch_row  (table, parameters);

	}/* get_latest_by_project */


	static log (current_entry, timestamp) {

		let parameters = new FormData ();
		
		parameters.set ("action", table);
		parameters.set ("client_id", current_entry?.client_id?.toString ());
		parameters.set ("project_id", current_entry?.project_id?.toString ());

		parameters.set ("notes", current_entry?.notes ?? blank);
		parameters.set ("billed", false);

		parameters.set ("time_stamp", timestamp.format (date_formats.database_timestamp));

		return Database.save_row (table, parameters);

	}// log;

}// LoggingModel;