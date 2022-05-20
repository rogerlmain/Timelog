import Database from "classes/database";
import { nested_value } from "classes/common";


export default class ProjectModel {


	static fetch (client_id) {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		parameters.set ("client_id", client_id.toString ());
		return Database.fetch_data ("projects", parameters);
	}// fetch_by_client;


	static fetch_by_id (project_id) {
		let parameters = new FormData ();
		parameters.set ("project_id", project_id.toString ());
		parameters.set ("action", "details");
		return Database.fetch_row ("projects", parameters);
	}// fetch_by_id;

	
}// ProjectModel;

