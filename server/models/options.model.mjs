import Database from "../database.mjs";
import "../globals.mjs";


export default class OptionsModel extends Database {


	get_options_by_company (company_id, respond) { 

		let result = null;

		return new Promise ((resolve, reject) => this.data_query ("get_options_by_company", [company_id]).then (options => {

			if (Array.isArray (options)) {
				for (let option of options) {
					if (not_set (result)) result = {};
					result [option.id] = option.value;
				}// for;
			}// if;

			if (respond) this.send_result_data (result);
			resolve (result);
	
		}).catch (error => reject (error)));

	}/* get_options_by_company */;


	save_option (values) {

		let procedure = "save_option";
		let parameters = [values.company_id, values.option_id, values.value];

		this.execute_query (procedure, parameters);

	}/* save_option */;


}/* OptionsModel */;
