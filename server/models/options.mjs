import Database from "../database.mjs";


export default class AccountOptionsData extends Database {


	get_options = () => this.execute_query ("get_account_options", [global.account_id]);


	save_option (values) {

		let procedure = "save_account_option";
		let parameters = [values.company_id, values.option_id, values.value];

		this.execute_query (procedure, parameters);

	}/* save_option */;


}/* AccountOptionsData */;
