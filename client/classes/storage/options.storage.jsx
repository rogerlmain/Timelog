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


	static #get = name => super.get (store_name, CompanyStorage.active_company_id ())?.[name];

	static #set (name, value) {

		let company_id = CompanyStorage.active_company_id ();
		let options = OptionsStorage.get_store ();
		
		if (not_set (options)) options = {};
		if (not_set (options [company_id])) options [company_id] = {};

		options [company_id][name] = value;

		OptionsStorage.set_store (options);

	}// #set;


	/********/


	static get_store = () => LocalStorage.get_store (store_name);
	static set_store = value => LocalStorage.set_store (store_name, value);


	/********/


	static get_options = () => OptionsStorage.get_store ()?.[CompanyStorage.active_company_id ()];
	static set_by_company_id = (company_id, value) => LocalStorage.set_store ({...LocalStorage.get_store (), [company_id]: value });


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


	static default_options (account_type) {
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


	static start_rounding = () => OptionsStorage.#get (option_types.start_rounding) ?? date_rounding.off;
	static end_rounding = () => OptionsStorage.#get (option_types.end_rounding) ?? date_rounding.off;

	static single_client = () => OptionsStorage.client_limit () == 1;
	static single_project = () => OptionsStorage.project_limit () == 1;

	static client_limit = () => OptionsStorage.#get (option_types.client_limit);
	static client_slots = (used = 0) => client_slots [OptionsStorage.client_limit () - 1] - used;

	static project_limit = () => OptionsStorage.#get (option_types.project_limit) ?? 1;
	static project_slots = (used = 0) => project_slots [OptionsStorage.project_limit () - 1] - used;

	static billing_option = () => OptionsStorage.#get (option_types.billing_option) ?? 1;
	static editing_option = () => OptionsStorage.#get (option_types.editing_option) ?? 1;
	static rounding_option = () => OptionsStorage.#get (option_types.rounding_option) ?? 1;
		
	static can_bill = () => OptionsStorage.billing_option () == toggled.true;
	static can_edit = () => OptionsStorage.editing_option () == toggled.true;
	static can_round = () => OptionsStorage.rounding_option () == toggled.true;

	static truetime = () => (OptionsStorage.granularity () == granularity_types.truetime);
	
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