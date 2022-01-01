import Database from "../database.mjs";


export default class MiscData extends Database {


	get_statuses () {
		this.execute_query ("call get_task_statuses ()");
	}// get_entries;


}// MiscData;


