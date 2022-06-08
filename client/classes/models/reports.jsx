import BaseControl from "controls/abstract/base.control";
import Database from "classes/database";


export default class ReportsModel extends BaseControl {

	static fetch_by_project (project_id) {
		return new Promise ((resolve, reject) => {

			let parameters = new FormData ();

			parameters.set ("action", "by_project");
			parameters.set ("project_id", project_id.toString ());

			Database.fetch_data ("reports", parameters).then (data => resolve (data)).catch (error => reject (error));

		});
	}// fetch_by_project;

}// ReportsModel;