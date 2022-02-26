import Database from "../database.mjs";


export default class AccountOptionsData extends Database {


	get_options = () => this.execute_query ("get_account_options", [global.account.account_id]);


	save_option (option_id, value) {

		let procedure = "save_account_option";
		let parameters = [global.account.account_id, option_id, value];

		this.execute_query (procedure, parameters);

	}/* save_option */;


}/* AccountOptionsData */;
