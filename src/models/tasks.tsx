import Database from "classes/database";
import DataModel from "./data.model";


export class TaskItem {
	task_id: number;
	client_id: number;
	client_name: string;
	project_id: number;
	project_name: string;
	assignee_id: number;
	task_type_id: number;
	status_id: number;
	status: string;
	name: string;
	description: string;
	estimate: number;
	deadline: Date;
}// TaskItem;


export class TaskList extends Array<TaskItem> {};


export default class TasksModel extends DataModel {

	public static fetch_tasks_by_assignee (account_id: number, callback: Function) {
		let parameters = new FormData ();
		parameters.append ("account_id", account_id.toString ());
		parameters.append ("action", "assignee");
		Database.fetch_data ("tasks", parameters).then (() => this.data_object (TaskList, callback))
	}// fetch_tasks_by_project;


	public static fetch_tasks_by_project (project_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("project_id", project_id.toString ());
		parameters.append ("action", "project");
		Database.fetch_data ("tasks", parameters).then (callback);
	}// fetch_tasks_by_project;


	public static fetch_task (task_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("task_id", task_id.toString ());
		parameters.append ("action", "details");
		Database.fetch_row ("tasks", parameters).then (callback);
	}// fetch_task;

}// TasksModel;