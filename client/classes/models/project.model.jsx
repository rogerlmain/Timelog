import Database from "classes/database";


const table_name = "projects";


export default class ProjectModel {


	static save_project (data) { return Database.save_data (table_name, data) }


	static async get_projects_by_client (client_id) {

		let parameters = new FormData ();

		parameters.set ("action", "list");
		parameters.set ("client_id", client_id.toString ());

		return await Database.fetch_data ("projects", parameters);

	}// get_projects_by_client;


	static get_project_by_id (project_id) {

		let parameters = new FormData ();

		parameters.set ("project_id", project_id.toString ());
		parameters.set ("action", "details");

		return Database.fetch_row ("projects", parameters);
		
	}// get_project_by_id;

	
}// ProjectModel;

