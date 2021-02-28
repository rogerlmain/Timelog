import DataModel from "../models.mjs";


class ClientData extends DataModel {


	get_clients (company_id) {
		let procedure = "call get_clients (?)";
		let parameters = [company_id];
		this.execute_query (procedure, parameters);
	}// get_clients;


}// ClientData;


export default ClientData;