import Database from "components/classes/database";


export class TasksModel {

	public static fetch_tasks (project_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "list");
		Database.fetch_rows ("tasks", parameters, callback)
	}// fetch_by_id;


	public static fetch_task (task_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("task_id", task_id.toString ());
		parameters.append ("action", "details");
		Database.fetch_row ("tasks", parameters, callback);
	}// fetch_task;

}// TasksModel;
