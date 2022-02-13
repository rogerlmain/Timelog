import Database from "../database.mjs";


class ClientData extends Database {


	get_clients (company_id) {
		let parameters = [company_id];
		this.execute_query ("get_clients", parameters);
	}// get_clients;


	get_client (client_id) {
		let parameters = [client_id];
		this.execute_query ("get_client", parameters);
	}// get_client;


	save_client (data) {
		let parameters = {
			client_id: global.isset (data.client_id) ? parseInt (data.client_id) : null,
			company_id: global.account.company_id,
			client_name: data.client_name,
			client_description: data.client_description,
			deleted: Boolean (data.deleted)
		}// parameters;
		this.execute_query ("save_client", parameters);
	}// save_client;


}// ClientData;


export default ClientData;