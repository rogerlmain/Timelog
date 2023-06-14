import Database from "client/classes/database";


const table = "clients";


export default class ClientModel {


	static delete_client (client_id) {
		let parameters = new FormData ();
		parameters.set ("action", "delete");
		parameters.set ("client_id", client_id);
		return Database.save_data (table, parameters);
	}// delete_client;


	static get_by_company (company_id) {
		let parameters = new FormData ();
		parameters.set ("action", "get_by_company");
		parameters.set ("company_id", company_id);
		return Database.fetch_data (table, parameters);
	}// get_by_client;


	static get_by_id (client_id) {
		let parameters = new FormData ();
		parameters.set ("client_id", client_id.toString ());
		parameters.set ("action", "details");
		return Database.fetch_row (table, parameters);
	}// get_by_id;

	
	static save_client (data) {
		data.set ("action", "save");
		return Database.save_data (table, data);
	}// save_client;


}// ClientModel;