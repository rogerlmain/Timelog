import Database from "classes/database";
import { ClientData } from "client/types/datatypes";


export default class ClientsModel {


	public static fetch_all (): Promise<ClientData []> {
		let parameters = new FormData ();
		parameters.set ("action", "list");
		return Database.fetch_data ("clients", parameters) as Promise<ClientData []>;
	}// fetch_by_client;


	public static fetch_by_id (client_id: number): Promise<ClientData> {
		let parameters = new FormData ();
		parameters.append ("client_id", client_id.toString ());
		parameters.append ("action", "details");
		return Database.fetch_row ("clients", parameters) as Promise<ClientData>;
	}// fetch_by_id;

	
}// ClientsModel;