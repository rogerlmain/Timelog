import Database from "../database.mjs";


export default class ProjectData extends Database {

	save_project (data) {

		let procedure = "save_project";

		let parameters = {
			client_id: data.client_id,
			project_id: data.project_Id,
			project_name: data.project_name, 
			project_code: data.project_code, 
			derscription: data.project_description,
			deleted: false
		}// parameters;

		this.execute_query (procedure, parameters);

	}/* save_project */;


	get_project_by_id (project_id) {

		let procedure = "get_project_by_id";
		let parameters = [project_id];

		this.execute_query (procedure, parameters);

	}/* get_project_by_id */;


	get_projects_by_client (client_id) {

		let procedure = "get_projects_by_client";
		let parameters = [client_id];

		this.execute_query (procedure, parameters);
		
	}/* get_projects_by_client */;


}/* ProjectData */;