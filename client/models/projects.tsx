import Database from "classes/database";


export default class ProjectsModel {


	public static fetch_by_client (client_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		parameters.set ("client_id", client_id.toString ());
		Database.fetch_data ("projects", parameters).then (callback);
	}// fetch_by_client;


	public static fetch_by_id (project_id: number) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "details");
		return Database.fetch_row ("projects", parameters);
	}// fetch_by_id;

	
}// ProjectsModel;

