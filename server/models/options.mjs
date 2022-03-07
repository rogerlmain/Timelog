import Database from "../database.mjs";


export default class AccountOptionsData extends Database {


	get_options = () => { 
		let result = this.data_query ("get_options", [global.account.company_id], true);
		return result;
	 }/* get_options */;


	save_option (values) {

		let procedure = "save_option";
		let parameters = [values.company_id, values.option_id, values.value];

		this.execute_query (procedure, parameters);

	}/* save_option */;


}/* AccountOptionsData */;
