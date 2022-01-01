import { isSet } from "util/types";
import Database from "../database.mjs";


class ClientData extends Database {


	get_clients (company_id) {
		let procedure = "call get_clients (?)";
		let parameters = [company_id];
		this.execute_query (procedure, parameters);
	}// get_clients;


	get_client (client_id) {
		let procedure = "call get_client (?)";
		let parameters = [client_id];
		this.execute_query (procedure, parameters);
	}// get_client;


	save_client (data) {
		let procedure = `call save_client (?, ?, ?)`;
		let parameters = {
			client_id: isSet (data.client_id) ? data.client_id : null,
			company_id: global.account.company_id,
			client_name: data.client_name,
			client_description: data.client_description,
		}// parameters;
		this.execute_query (procedure, parameters);
	}// save_client;


}// ClientData;


export default ClientData;