import Database from "client/classes/database";
import CompanyStorage from "../storage/company.storage";


const table = "offshore";


export default class OffshoreModel {


	static save_account (repository, token_id, user_id) {

		let data = new FormData ();

		data.append ("action", "save_account");
		data.append ("repository", repository);
		data.append ("token_id", token_id);
		data.append ("offshore_account", user_id);

		return Database.save_data (table, data);

	}// save_account;


	static save_token (data) {

		data.append ("action", "save_token");
		data.append ("company_id", CompanyStorage.active_company_id ());

		return Database.save_data (table, data);

	}/* save_token */;


	static get_tokens = () => Database.fetch_data (table, { 
		action: "get_tokens",
		company_id: CompanyStorage.active_company_id (),
	})/* get_tokens */;


	static get_repositories = () => Database.fetch_data (table, {
		action: "get_repositories",
		company_id: CompanyStorage.active_company_id (),
	})/* get_repositories */;


	static get_users = (token, repo) => Database.fetch_data (table, { 
		action: "get_users",
		token: token, 
		repo: repo,
	})/* get_users */;


}// OffshoreModel;