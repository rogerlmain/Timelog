import * as constants from "classes/types/constants";

import LocalStorage from "classes/local.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import OptionsModel from "client/classes/models/options.model";

import { isset, not_set } from "classes/common";


const store_name = "options";


export const boundaries = {
	start: "start",
	end: "end"
}// boundaries;


export const toggled = {
	false	: 1,
	true	: 2,
}// toggled;


export default class OptionStorage extends LocalStorage {


	static #get (name, company_id = null) { 
		let company = isset (company_id) ? company_id : CompanyStorage.active_company_id ();
		let options = super.get (store_name, company);
		return isset (options) ? (isset (options [name]) ? options [name] : null) : null;
	}// #get;


	static #set (name, value) {
		let company_id = CompanyStorage.active_company_id ();
		let options = super.get_all (store_name);
		
		if (not_set (options)) options = {};
		if (not_set (options [company_id])) options [company_id] = {};

		options [company_id][name] = value;

		super.set_store (store_name, options);
	}// #set;


	// POSSIBLY OBSOLETE


	// static get_options (company_id = null) {
	// 	let company = isset (company_id) ? company_id : CompanyStorage.active_company_id ();
	// 	let company_list = this.get_all (store_name, company);
	// 	return isset (company_list) ? company_list [company] : null;
	// }// get_options;

	// static set_all (value) {
	// 	super.set_store (store_name, value);
	// }// set_all;



	/********/
	

	static save_option (option, value) {	
		return new Promise ((resolve, reject) => {
			OptionsModel.save_option (option, value).then (data => {
				this.#set (option, value);
				resolve (data);
			}).catch (reject);
		});
	}// save_option;
	

	/********/


	static granularity (company_id = null) { 
		let granularity = OptionStorage.#get (constants.option_types.granularity, company_id);
		let result = not_set (granularity) ? constants.deadbeat_options.granularity : parseInt (granularity);
		return result;
	}// granularity;


	static start_rounding () { return OptionStorage.#get (constants.option_types.start_rounding) ?? constants.date_rounding.off }
	static end_rounding () { return OptionStorage.#get (constants.option_types.end_rounding) ?? constants.date_rounding.off }

	static single_client () { return OptionStorage.client_limit () == 1 }
	static single_project () { return OptionStorage.project_limit () == 1}

	static client_limit () { return OptionStorage.#get (constants.option_types.client_limit) ?? 1 }
	static project_limit () { return OptionStorage.#get (constants.option_types.project_limit) ?? 1 }

	static billing_option () { return OptionStorage.#get (constants.option_types.billing_option) ?? 1 }
	static rounding_option () { return OptionStorage.#get (constants.option_types.rounding_option) ?? 1 }

	static can_bill () { return OptionStorage.billing_option () == toggled.true }
	static can_round () { return OptionStorage.rounding_option () == toggled.true }

	
	static default_rate (value = null) { 
		if (isset (value)) return OptionStorage.save_option (constants.option_types.default_rate, value);
		return OptionStorage.#get (constants.option_types.default_rate) ?? 0; 
	}// default_rate;


	static subscribed (option) {
		switch (option) {
			case constants.option_types.granularity: return isset (this.granularity ());
			case constants.option_types.rounding: return (isset (this.start_rounding ()) || isset (this.end_rounding ()));
		}// switch;
		return false;
	}// subscribed;

}// OptionStorage;