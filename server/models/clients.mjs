import Database from "../database.mjs";


class ClientData extends Database {


	get_clients (account_id) {
		let parameters = [account_id];
		this.data_query ("get_clients", parameters).then (data => {
			global.response.send (data);
			this.connection.end ();
		});
	}// get_clients;


	get_client_by_id (client_id) {
		let parameters = [client_id];
		this.data_query ("get_client_by_id", parameters).then (data => {
			global.response.send (data);
			this.connection.end ();
		});
	}// get_client_by_id;


	save_client (data) {

		let parameters = {
			client_id: global.isset (data.client_id) ? parseInt (data.client_id) : null,
			company_id: data.company_id,
			client_name: data.client_name,
			client_description: data.client_description,
			deleted: Boolean (data.deleted)
		}// parameters;

		this.execute_query ("save_client", parameters);

	}// save_client;


}// ClientData;


export default ClientData;