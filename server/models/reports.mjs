import Database from "../database.mjs";


export default class ReportData extends Database {

	report_by_project (project_id) {
		let procedure = "report_by_project";
		let parameters = [project_id];
		this.execute_query (procedure, parameters);
	}/* report_by_project */;

}/* ReportData */;

