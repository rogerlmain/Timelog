import Database from "../database.mjs";


export default class OffshoreModel {


	static get_latest_projects = client_id => new Database ().data_query ("get_latest_offshore_projects", { client_id: client_id });


	static save_token = data => new Database ().execute_query ("save_offshore_token", {
		company_id: data.company_id,
		offshore_type: data.offshore_type,
		offshore_id: data.offshore_id,
		offshore_token: data.offshore_token
	})/* save_token */;


	static save_account = data => new Database ().execute_query ("save_offshore_account", {
		account_id: data.account_id,
		token_id: parseInt (data.token_id),
		repository: data.repository,
		offshore_account: data.offshore_account,
	})/* save_account */;


	static get_token = token_id => new Database ().data_query ("get_offshore_token_by_id", { token_id: token_id });
	static get_tokens = company_id => new Database ().data_query ("get_offshore_tokens", { company_id: company_id });


}// OffshoreModel;
