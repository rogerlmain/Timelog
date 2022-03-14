import Database from "classes/database";


export default class ProjectsModel {


	static fetch_by_client (client_id, callback) {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		parameters.set ("client_id", client_id.toString ());
		Database.fetch_data ("projects", parameters).then (callback);
	}// fetch_by_client;


	static fetch_by_id (project_id) {
		let parameters = new FormData ();
		parameters.set ("project_id", project_id.toString ());
		parameters.set ("action", "details");
		return Database.fetch_row ("projects", parameters);
	}// fetch_by_id;

	
}// ProjectsModel;
