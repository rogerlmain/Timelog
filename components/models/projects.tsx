import { Database } from "../classes/database";


export class ProjectsModel extends Database {

	public fetch_by_id (project_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "details");
		this.fetch_item ("projects", parameters, callback)
	}// fetch_by_id;

}// ProjectsModel;


export const projects_model = new ProjectsModel ();