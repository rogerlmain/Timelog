import DataModel from "../models.mjs";


class TaskData extends DataModel {

	get_tasks (project_id) {
		let procedure = "call get_tasks (?)";
		let parameters = [project_id];
		this.execute_query (procedure, parameters);
	}// get_tasks;


	get_task (task_id) {
		let procedure = "call get_task (?)";
		let parameters = [task_id];
		this.execute_query (procedure, parameters);
	}// get_task;


	save (fields) {
		let procedure = "call save_task (?, ?, ?, ?, ?, ?, ?)";
		let parameters = [
			parseInt (fields.task_id), parseInt (fields.project_id), null, fields.task_name,
			fields.task_description, parseInt (fields.estimate), fields.deadline
		];
		this.execute_query (procedure, parameters);
	}// save;

}// models;


export default TaskData;







