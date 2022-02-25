import { response } from "express";
import Database from "../database.mjs";


class EntryData extends Database {

	// get_entries (client_id, project_id) {
	// 	let procedure = "call get_entries (?, ?)";
	// 	let parameters = [ client_id, project_id ];
	// 	this.execute_query (procedure, parameters);
	// }// get_entries;


	get_latest_entry () {
		let procedure = "get_latest_entry";
		if (global.is_null (global.account)) return response.send ();
		this.execute_query (procedure, [account.account_id], data => {
			let x = data;
		});
		
// 		.then (results => {
// 			if ((results == null) || (results.length > 1)) throw "Invalid data response: models.signin";
			
// let str = this.cookie_string (results);

// 			if (results.length == 1) response.cookie ("current_entry", this.cookie_string (results), { encode: String });
// 		});

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