import Database from "classes/database";


export default class ClientsModel {


	public static fetch_all (callback: any) {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		Database.fetch_data ("clients", parameters).then (callback);
	}// fetch_by_client;

	
}// ClientsModel;