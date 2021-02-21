import Database from "components/classes/database";


export class TasksModel {

	public fetch_tasks (project_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "list");
		Database.fetch_rows ("tasks", parameters, callback)
	}// fetch_by_id;

}// TasksModel;


export const tasks_model = new TasksModel ();