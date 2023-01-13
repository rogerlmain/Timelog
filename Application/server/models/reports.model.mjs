import Database from "../database.mjs";


export default class ReportsModel extends Database {


	report_daily_by_account (account_id, report_date) {

		let procedure = "report_daily_by_account";
		let parameters = [account_id, report_date];

		this.execute_query (procedure, parameters);

	}// report_daily_by_account;


	report_by_project (project_id, start_date, end_date) {

		let procedure = "report_by_project";
		let parameters = [project_id, start_date, end_date];

		this.execute_query (procedure, parameters);
		
	}/* report_by_project */;


}/* ReportsModel */;