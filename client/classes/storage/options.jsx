import * as constants from "classes/types/constants";
import * as common from "classes/common";

import LocalStorage from "classes/local.storage";
import Companies from "classes/storage/companies";

import { MainContext } from "classes/types/contexts";


const store_name = "options";


export const boundaries = {
	start: "start",
	end: "end"
}// boundaries;


export default class Options extends LocalStorage {


	static get (name, company_id = null) { 
		let company = common.isset (company_id) ? company_id : Companies.active_company_id ();
		let options = super.get (store_name, company);
		return common.isset (options) ? (common.isset (options [name]) ? options [name] : null) : null;
	}// get;


	static get_options (company_id = null) {
		let company = common.isset (company_id) ? company_id : Companies.active_company_id ();
		let company_list = this.get_all (store_name, company);
		return common.isset (company_list) ? company_list [company] : null;
	}// get_options;


	static set (name, value) { 
		let company_id = Companies.active_company_id ();
		let options = super.get_all (store_name);
		
		if (common.not_set (options)) options = {};
		if (common.not_set (options [company_id])) options [company_id] = {};

		options [company_id][name] = value;

		super.set_store (store_name, options);
	}// set;


	static set_all (value) {
		super.set_store (store_name, value);
	}// set_all;


	static granularity (company_id = null) { 
		let granularity = Options.get (constants.option_types.granularity, company_id);
		let result = common.not_set (granularity) ? constants.default_options.granularity : parseInt (granularity);
		return result;
	}// granularity;


	static start_rounding () { return Options.get (constants.option_types.start_rounding) ?? constants.date_rounding.off }
	static end_rounding () { return Options.get (constants.option_types.end_rounding) ?? constants.date_rounding.off }

	static client_limit () { return Options.get (constants.option_types.client_limit) ?? 1 }
	static project_limit () { return Options.get (constants.option_types.project_limit) ?? 1 }


	static subscribed (option) {
		switch (option) {
			case constants.option_types.granularity: return common.isset (this.granularity ());
			case constants.option_types.rounding: return (common.isset (this.start_rounding ()) || common.isset (this.end_rounding ()));
		}// switch;
		return false;
	}// subscribed;

}// Options;