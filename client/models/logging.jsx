import Database from "classes/database";


export default class LoggingModel {


	static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.append ("action", "latest");
		return Database.fetch_row ("logging", parameters);
	}// fetch_latest_entry;


	static log (project_id) {
		let parameters = new FormData ();
		parameters.append ("action", "logging");
		parameters.append ("project_id", project_id.toString ());
		return Database.fetch_row ("logging", parameters);
	}// log;

	
}// ProjectsModel;

