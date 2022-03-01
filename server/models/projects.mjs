import Database from "../database.mjs";


export default class ProjectData extends Database {

	save_project (data) {

		let project_response = null;

		let save_project_details = () => {
			let procedure = "save_project";
			let parameters = [
				parseInt (data.client_id),
				global.isset (data.project_id) ? parseInt (data.project_id) : null,
				data.project_name, 
				data.project_code, 
				data.project_description,
				false
			];
			this.execute_query (procedure, parameters);//, project_handler);
		}/* save_project_details */;


		save_project_details ();


	}/* save_project */;


	get_project (project_id) {
		let procedure = "get_project";
		let parameters = [project_id];
		this.execute_query (procedure, parameters);
	}/* get_project */;


	get_projects_by_client (client_id) {
		let procedure = "get_projects_by_client";
		let parameters = [client_id];
		this.execute_query (procedure, parameters);
	}/* get_projects_by_client */;


}/* ProjectData */;