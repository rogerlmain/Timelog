import Database from "../database.mjs";


export default class ClientData extends Database {


	get_clients_by_company (company_id) {
		let parameters = [company_id];
		this.execute_query ("get_clients_by_company", parameters);
	}// get_clients;


	get_client_by_id (client_id) {
		let parameters = [client_id];
		this.execute_query ("get_client_by_id", parameters);
	}// get_client_by_id;


	save_client (data) {

		let parameters = {
			client_id: global.isset (data.client_id) ? parseInt (data.client_id) : null,
			company_id: parseInt (data.company_id),
			client_name: data.client_name,
			client_description: data.client_description,
			deleted: Boolean (data.deleted)
		}// parameters;

		this.execute_query ("save_client", parameters);

	}// save_client;


}// ClientData;
