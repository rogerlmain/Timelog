import Database from "classes/database";
import { ClientData } from "client/types/datatypes";


export default class ClientsModel {


	static fetch_all () {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		return Database.fetch_data ("clients", parameters);
	}// fetch_by_client;


	static fetch_by_id (client_id) {
		let parameters = new FormData ();
		parameters.append ("client_id", client_id.toString ());
		parameters.append ("action", "details");
		return Database.fetch_row ("clients", parameters);
	}// fetch_by_id;

	
}// ClientsModel;