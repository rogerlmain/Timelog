import Database from "../database.mjs";


class EntryData extends Database {

	// get_entries (client_id, project_id) {
	// 	let procedure = "call get_entries (?, ?)";
	// 	let parameters = [ client_id, project_id ];
	// 	this.execute_query (procedure, parameters);
	// }// get_entries;


	get_latest_entry () {
		let procedure = "get_latest_entry";
		if (global.is_null (global.account)) {
			response.send ();
			return;
		}// if;
		this.execute_query (procedure, [account.account_id]);
	}// get_latest_entry;


	save_entry (project_id) {
		let procedure = "save_entry";
		let parameters = [
			account.account_id,
			parseInt (project_id)
		];
		this.execute_query (procedure, parameters);
	}// save_entry;

}// EntryData;


export default EntryData;