import BaseControl from "client/controls/abstract/base.control";
import Database from "client/classes/database";


const table = "reports";


export default class ReportsModel extends BaseControl {

	static fetch_by_project (project_id, parameters) {
		return new Promise ((resolve, reject) => Database.fetch_data (table, {
			action: "project",
			project_id: project_id,
			...parameters,
		}).then (data => resolve (data)).catch (error => reject (error)));
	}// fetch_by_project;


	// fetch_by_team () {}


}// ReportsModel;