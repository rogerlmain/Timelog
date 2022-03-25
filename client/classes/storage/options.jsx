import LocalStorage from "classes/local.storage";
import Companies from "classes/storage/companies";

import { default_options, option_types } from "client/classes/types/constants";
import { is_null, isset, not_set } from "classes/common";


const store_name = "options";


export const log_entry_boundaries = {
	start: "start",
	end: "end"
}// log_entry_boundaries;


export default class Options extends LocalStorage {

	static get (name) { 
		let company_id = Companies.active_company_id ();
		let options = super.get (store_name, company_id);
		return isset (options) ? options [name] : null;
	}// get;


	static set (name, value) { 
		let options = super.get_all (store_name);
		let company_id = Companies.active_company_id ();
		
		if (not_set (options)) options = {};
		if (not_set (options [company_id])) options [company_id] = {};

		options [company_id][name] = value;

		super.set_store (store_name, options);
	}// set;


	static granularity = () => { 
		let granularity = Options.get (option_types.granularity);
		let result = not_set (granularity) ? default_options.granularity : parseInt (granularity);
		return result;
	}/* granularity */;


	static rounding = (end) => {
		let result = Options.get (option_types [`${end}_rounding`]);
		return result;
	}// rounding;

}// Options;