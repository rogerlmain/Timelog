import Database from "classes/database";


export default class LoggingModel {


	public static fetch_current_entry () {
		let parameters = new FormData ();
		parameters.append ("action", "latest");
		return Database.fetch_row ("logging", parameters);
	}// fetch_current_entry;

	
}// ProjectsModel;

