import Database from "../database.mjs";


class ProjectData extends Database {

	save_project (fields) {

//		let project_members = JSON.parse (fields.selected_team);
		let project_response = null;


		let project_handler = (error, results) => {
			if (global.is_null (results)) throw "Invalid data response: project_handler";
			project_response = { project: results [0][0] };
			save_team ();
		}/* project_handler */;


		let team_handler = (error, results) => {
			if (global.is_null (results)) throw "Invalid data response: team_handler";
			if (global.is_null (project_response.members)) project_response.members = [];
			project_response.members.push (results [0][0]);
			if (project_response.members.length < project_members.length) return;
			response.send (JSON.stringify (project_response));
		}/* team_handler */;


		let save_project_member = (error) => {
			if (Array.isArray (project_members)) {
				project_members.forEach ((item) => {
					let procedure = "save_project_member";
					let parameters = [fields.project_id, item.account_id, item.role_id];
					this.execute_query (procedure, parameters, team_handler);
				});
				return;
			}/* if */;
			response.send (project_response);
		}/* save_project_member */;


		let save_team = () => {
			let procedure = "reset_project_members";
			let parameters = [fields.project_id];
			this.execute_query (procedure, parameters, save_project_member);
		}/* save_team */;


		let save_project_details = () => {
			let procedure = "save_project";
			let parameters = [
				fields.project_name, 
				fields.project_code, 
				fields.project_description, 
				parseInt (fields.client_id),
				parseInt (fields.project_id)
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


export default ProjectData;