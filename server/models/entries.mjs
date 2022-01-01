import Database from "../database.mjs";


class EntryData extends Database {

	get_entries (client_id, project_id) {
		let procedure = "call get_entries (?, ?)";
		let parameters = [ client_id, project_id ];
		this.execute_query (procedure, parameters);
	}// get_entries;


	get_current_entry () {
		let procedure = "call get_current_entry (?)";
		if (global.is_null (global.account)) {
			response.send ();
			return;
		}// if;
		this.execute_query (procedure, [account.account_id]);
	}// get_current_entry;


	save_entry (client_id, project_id, entry_id) {
		let procedure = "call save_entry (?, ?, ?, ?)";
		let parameters = [
			account.account_id,
			parseInt (client_id),
			parseInt (project_id),
			global.isset (entry_id) ? parseInt (entry_id) : null
		];
		this.execute_query (procedure, parameters);
	}// save_entry;

}// EntryData;


export default EntryData;