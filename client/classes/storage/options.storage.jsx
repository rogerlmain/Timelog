import LocalStorage from "client/classes/local.storage";
import CompanyStorage from "client/classes/storage/company.storage";

import OptionsModel from "client/classes/models/options.model";

import { account_types, date_rounding, granularity_types } from "client/classes/types/constants";
import { isset, not_set } from "client/classes/common";
import { client_slots, company_options, corporate_options, deadbeat_options, enterprise_options, freelance_options, option_types, project_slots } from "client/classes/types/options";


const store_name = "options";


export const boundaries = {
	start: "start",
	end: "end"
}// boundaries;


export const toggled = {
	false	: 1,
	true	: 2,
}// toggled;


export default class OptionsStorage extends LocalStorage {


	static #get (name) { 
		let options = this.get_options ();
		return isset (options) ? (isset (options [name]) ? options [name] : null) : null;
	}// #get;


	static #set (name, value) {
		let company_id = CompanyStorage.active_company_id ();
		let options = this.get_all ();
		
		if (not_set (options)) options = {};
		if (not_set (options [company_id])) options [company_id] = {};

		options [company_id][name] = value;

		LocalStorage.set_store (store_name, options);
	}// #set;


	/********/
	

	static get_all () { return super.get_all (store_name) }
	static get_options () { return super.get (store_name, CompanyStorage.active_company_id ()) }

	static set_by_company_id (company_id, value) { this.set_store (store_name, {...super.get_all (), [company_id]: value }) }


	static save_option (option, value) {	
		return new Promise ((resolve, reject) => {
			OptionsModel.save_option (option, value).then (data => {
				this.#set (option, value);
				resolve (data);
			}).catch (reject);
		});
	}// save_option;


	static save_options = options => {
	
		let count = Object.keys (options).length;

		return new Promise (resolve => {
			Object.keys (options).forEach (option => {
				OptionsStorage.save_option (option_types [option], options [option]).then (() => { if (--count == 0) resolve () });
			});
		});
	
	}/* save_options */;


	static set_options (account_type) {
		return new Promise (resolve => {
			switch (account_type) {
				case account_types.deadbeat	 : resolve (OptionsStorage.save_options (deadbeat_options)); break;
				case account_types.freelance : resolve (OptionsStorage.save_options (freelance_options)); break;
				case account_types.company	 : resolve (OptionsStorage.save_options (company_options)); break;
				case account_types.corporate : resolve (OptionsStorage.save_options (corporate_options)); break;
				case account_types.enterprise: resolve (OptionsStorage.save_options (enterprise_options)); break;
			}// switch;
		});
	}/* set_permissions */;


	/********/


	static granularity () { 
		let granularity = OptionsStorage.#get (option_types.granularity);
		let result = not_set (granularity) ? deadbeat_options.granularity : parseInt (granularity);
		return result;
	}// granularity;


	static increment () {
		switch (OptionsStorage.granularity ()) {
			case granularity_types.hourly	: return Date.increments.hours;
			case granularity_types.quarterly: return 15 * Date.increments.minutes;
			case granularity_types.minutely	: return Date.increments.minutes;
			default: return Date.increments.seconds;
		}// switch;
	}// increment;


	static start_rounding () { return OptionsStorage.#get (option_types.start_rounding) ?? date_rounding.off }
	static end_rounding () { return OptionsStorage.#get (option_types.end_rounding) ?? date_rounding.off }

	static single_client () { return OptionsStorage.client_limit () == 1 }
	static single_project () { return OptionsStorage.project_limit () == 1}

	static client_limit () { return OptionsStorage.#get (option_types.client_limit) ?? 1 }
	static client_slots (used = 0) { return client_slots [OptionsStorage.client_limit () - 1] - used }

	static project_limit () { return OptionsStorage.#get (option_types.project_limit) ?? 1 }
	static project_slots (used = 0) { return project_slots [OptionsStorage.project_limit () - 1] - used }

	static billing_option () { return OptionsStorage.#get (option_types.billing_option) ?? 1 }
	static editing_option () { return OptionsStorage.#get (option_types.editing_option) ?? 1 }
	static rounding_option () { return OptionsStorage.#get (option_types.rounding_option) ?? 1 }

	static can_bill () { return OptionsStorage.billing_option () == toggled.true }
	static can_edit () { return OptionsStorage.editing_option () == toggled.true }
	static can_round () { return OptionsStorage.rounding_option () == toggled.true }


	static truetime () { return (OptionsStorage.granularity () == granularity_types.truetime) }

	
	static default_rate (value = null) { 
		if (isset (value)) return OptionsStorage.save_option (option_types.default_rate, value);
		return OptionsStorage.#get (option_types.default_rate) ?? 0; 
	}// default_rate;


	static subscribed (option) {
		switch (option) {
			case option_types.granularity: return isset (this.granularity ());
			case option_types.rounding: return (isset (this.start_rounding ()) || isset (this.end_rounding ()));
		}// switch;
		return false;
	}// subscribed;

}// OptionsStorage;