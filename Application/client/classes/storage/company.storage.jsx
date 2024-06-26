import LocalStorage from "client/classes/local.storage"
import CompaniesModel from "client/classes/models/companies.model";

import { isset, is_null, not_set } from "client/classes/common";


const store_name = "companies";


export const default_name = "Default company";
export const default_description = `${default_name} description`;


export default class CompanyStorage extends LocalStorage {


	static #get = company_id => LocalStorage.get (store_name, company_id);
	static #set = values => LocalStorage.set_store (store_name, values);


	/**** Public Methods ****/


	static load_companies = () => new Promise ((resolve, reject) => {
		CompaniesModel.get_companies ().then (data => {

			let result = null;

			data.forEach (company => {

				let company_id = company.company_id;
				
				if (is_null (result)) result = {};
				delete company.company_id;

				result [company_id] = company;
				
			});

			CompanyStorage.#set (result);
			resolve ();

		}).catch (reject);
	})/* load_companies */;


	static active_company_id () { return this.#get ("active_company") }
	static square_id () { return this.active_company ()?.square_id }

	static company_selected () { return isset (this.active_company_id ()) }
	static paid_account () { return isset (this.square_id ()) }

	static set_active_company (value) { super.set_item (store_name, "active_company", value) }
	static active_company = () => this.company_list ()?.[this.active_company_id ()]


	static add_companies (companies) {

		let company_list = LocalStorage.get_store (store_name);
		
		if (is_null (companies)) return;

		for (let company of Array.arrayify (companies)) {

			let company_id = company.company_id;

			if (not_set (company_id)) continue;
			if (is_null (company_list)) company_list = {}
			if (isset (company_list [company_id])) continue;

			company_list [company_id] = {...company};
			delete company_list [company_id].company_id;

		}// for;

		this.#set (company_list);

	}// add_companies;


	static company_count () {
		let companies = this.company_list ()?.get_values ();
		return isset (companies) ? companies.length : 0;
	}// company_count;
	

	static company_list () { 
		let result = LocalStorage.get_store (store_name);
		if (isset (result)) delete result.active_company;
		return result;
	}// company_list;

	
	static company_name = () => this.active_company ()?.company_name;


	static save_company = data => new Promise ((resolve, reject) => CompaniesModel.save_company (data).then (response => {

		if (not_set (response?.company_id)) return reject (response);

		let company = { ...data.toObject (), company_id: response.company_id }
		let company_id = company.company_id;

		delete company.action;
		delete company.company_id;
		
		this.#set ({[company_id]: company});
		resolve ({ ...company, company_id: company_id });

	}));
	

}// CompanyStorage;