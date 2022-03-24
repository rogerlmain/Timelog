import Database from "../database.mjs";


export default class OptionsData extends Database {


	get_options_by_company = (company_id) => { 
		let result = this.data_query ("get_options_by_company", [company_id], true);
		return result;
	 }/* get_options_by_company */;


	save_option (values) {

		let procedure = "save_option";
		let parameters = [values.company_id, values.option_id, values.value];

		this.execute_query (procedure, parameters);

	}/* save_option */;


}/* OptionsData */;
