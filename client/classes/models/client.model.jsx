import Database from "classes/database";


const table_name = "clients";


export default class ClientModel {


	static delete_client (client_id) {
		let parameters = new FormData ();
		parameters.set ("action", "delete");
		parameters.set ("client_id", client_id);
		return Database.save_data (table_name, parameters);
	}// delete_client;


	static save_client (data) { return Database.save_data (table_name, data) }


	static fetch_by_company (company_id) {
		let parameters = new FormData ();
		parameters.set ("action", "list_by_company");
		parameters.set ("company_id", company_id);
		return Database.fetch_data (table_name, parameters);
	}// fetch_by_client;


	static fetch_by_id (client_id) {
		let parameters = new FormData ();
		parameters.set ("client_id", client_id.toString ());
		parameters.set ("action", "details");
		return Database.fetch_row (table_name, parameters);
	}// fetch_by_id;

	
}// ClientModel;