import Database from "../database.mjs";


export default class OffshoreModel {


	static save_offshore_token = data => {

		let parameters = {
			company_id: data.company_id,
			offshore_type: data.offshore_type,
			offshore_id: data.offshore_id,
			offshore_token: data.offshore_token
		}/* parameters */;

		new Database ().execute_query ("save_offshore_token", parameters);

	}/* save_offshore_token */;


	static get_offshore_tokens = data => new Database ().execute_query ("get_offshore_tokens", { company_id: data.company_id });


}// OffshoreModel;
