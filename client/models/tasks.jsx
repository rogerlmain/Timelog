import Database from "classes/database";
import DataModel from "models/data.model";


export default class TasksModel extends DataModel {

	static fetch_tasks_by_assignee (account_id, callback) {
		let parameters = new FormData ();
		parameters.append ("account_id", account_id.toString ());
		parameters.append ("action", "assignee");
		Database.fetch_data ("tasks", parameters).then (() => this.data_object (TaskList, callback))
	}// fetch_tasks_by_project;


	static fetch_tasks_by_project (project_id, callback) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "project");
		Database.fetch_data ("tasks", parameters).then (callback);
	}// fetch_tasks_by_project;


	static fetch_task (task_id, callback) {
		let parameters = new FormData ();
		parameters.append ("task_id", task_id.toString ());
		parameters.append ("action", "details");
		Database.fetch_row ("tasks", parameters).then (callback);
	}// fetch_task;

}// TasksModel;