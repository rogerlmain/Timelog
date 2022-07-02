import BaseControl from "controls/abstract/base.control";
import Database from "classes/database";


export default class ReportsModel extends BaseControl {

	static fetch_by_project (project_id, parameters) {
		return new Promise ((resolve, reject) => Database.fetch_data ("reports", {
			action: "project",
			project_id: project_id,
			...parameters,
		}).then (data => resolve (data)).catch (error => reject (error)));
	}// fetch_by_project;

}// ReportsModel;