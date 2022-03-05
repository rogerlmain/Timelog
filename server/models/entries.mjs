import { response } from "express";
import Database from "../database.mjs";


class EntryData extends Database {

	// get_entries (client_id, project_id) {
	// 	let procedure = "call get_entries (?, ?)";
	// 	let parameters = [ client_id, project_id ];
	// 	this.data_query (procedure, parameters);
	// }// get_entries;


	get_latest_entry (account_id) {
		this.data_query ("get_latest_entry", [account_id]).then (data => {
			global.response.send (data);
			this.connection.end ();
 		});
	}// get_latest_entry;


	save_entry (account_id, project_id) {
		let parameters = [
			account_id,
			parseInt (project_id)
		];
		this.data_query ("save_entry", parameters).then (data => {
			global.response.send (data);
			this.connection.end ();
 		});
	}// save_entry;

}// EntryData;


export default EntryData;