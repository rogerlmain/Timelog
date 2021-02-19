import { Database } from "components/classes/database";


export class TasksModel extends Database {

	public fetch_tasks (project_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "list");
		this.fetch_item ("tasks", parameters, callback)
	}// fetch_by_id;

}// TasksModel;


export const tasks_model = new TasksModel ();