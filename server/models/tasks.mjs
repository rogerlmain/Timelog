import Database from "../database.mjs";


class TaskData extends Database {

	get_tasks_by_assignee (account_id) {
		let procedure = "call get_tasks_by_assignee (?)";
		let parameters = [account_id];
		this.execute_query (procedure, parameters);
	}// get_tasks_by_assignee;


	get_tasks_by_project (project_id) {
		let procedure = "call get_tasks_by_project (?)";
		let parameters = [project_id];
		this.execute_query (procedure, parameters);
	}// get_tasks_by_project;


	get_task (task_id) {
		let procedure = "call get_task (?)";
		let parameters = [task_id];
		this.execute_query (procedure, parameters);
	}// get_task;


	save (fields) {
		let procedure = "call save_task (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		let parameters = {
			task_id: this.parse_integer (fields.task_id), 
			project_id: this.parse_integer (fields.project_id), 
			task_type_id: null, 
			assignee_id: this.parse_integer (fields.assignee_id),
			status_id: this.parse_integer (fields.status_id),
			name: fields.task_name,
			description: fields.task_description, 
			estimate: this.parse_integer (fields.estimate), 
			deadline: fields.deadline
		};
		this.execute_query (procedure, parameters);
	}// save;

}// models;


export default TaskData;







