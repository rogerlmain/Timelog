import BaseControl from "client/controls/abstract/base.control";
import Database from "client/classes/database";


const option = "reports";


export default class ReportsModel extends BaseControl {

	static get_by_project = (project_id, parameters) => Database.fetch_data (option, {
		action: "project",
		project_id: project_id,
		...parameters,
	})/* get_by_project */;


	static get_daily_user_report = (account_id, report_date) => Database.fetch_data (option, {
		action: "daily",
		account_id: account_id,
		report_date: report_date,
	})/* get_daily_user_report */


}// ReportsModel;