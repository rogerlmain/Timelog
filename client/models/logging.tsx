import Database from "classes/database";


export default class LoggingModel {


	public static fetch_latest_entry () {
		let parameters = new FormData ();
		parameters.append ("action", "latest");
		return Database.fetch_row ("logging", parameters);
	}// fetch_latest_entry;


	public static log (project_id: number) {
		let parameters = new FormData ();
		parameters.append ("action", "logging");
		parameters.append ("project_id", project_id.toString ());
		return Database.fetch_row ("logging", parameters);
	}// log;

	
}// ProjectsModel;

