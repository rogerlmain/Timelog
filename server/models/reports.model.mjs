import Database from "../database.mjs";


export default class ReportsModel extends Database {

	report_by_project (project_id, start_date, end_date) {

		let procedure = "create_report";
		let parameters = [project_id, start_date, end_date];

		this.execute_query (procedure, parameters);
		
	}/* report_by_project */;

}/* ReportsModel */;

