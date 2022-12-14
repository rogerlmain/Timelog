import Database from "../database.mjs";


class LoggingModel extends Database {

	
	get_logs (client_id, project_id) {
		this.execute_query ("get_entries", [client_id, project_id]);
	}// get_logs;


	get_active_logging_by_company (company_id) {
		this.execute_query ("get_active_logging_by_company", [company_id]);
	}// get_active_logging_by_company;


	get_latest_entry (account_id) {
		return this.data_query ("get_latest_entry", [account_id]);
	}// get_latest_entry;


	save_billing (fields) {

		let parameters = [
			fields.log_id,
			fields.billed.equals ("true"),
		];

		return this.execute_query ("set_billing", parameters);

	}// save_billing;


	save_log_entry (fields) {

		let parameters = [
			parseInt (fields.account_id),
			parseInt (fields.client_id),
			parseInt (fields.project_id),
			fields.offshore_task_id,
			fields.notes,
			fields.time_stamp
		];

		this.execute_query ("save_log_entry", parameters);

	}// save_log_entry;

}// LoggingModel;


export default LoggingModel;