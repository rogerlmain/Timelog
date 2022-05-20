import Database from "../database.mjs";


class LoggingData extends Database {

	get_logs (client_id, project_id) {
		let procedure = "call get_entries (?, ?)";
		let parameters = [ client_id, project_id ];
		this.data_query (procedure, parameters);
	}// get_logs;


	latest_log_entry () {
		return this.data_query ("get_latest_entry", [global.account.account_id]);
	}// latest_log_entry;


	save_log_entry (fields) {

		let parameters = [
			fields.account_id,
			parseInt (fields.client_id),
			parseInt (fields.project_id),
			fields.time_stamp
		];

		this.execute_query ("save_entry", parameters);

	}// save_log_entry;

}// LoggingData;


export default LoggingData;