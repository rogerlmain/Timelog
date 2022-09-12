import LocalStorage from "client/classes/local.storage"

import { isset, get_values, is_null, nested_value, not_array, not_set } from "client/classes/common";


const store_name = "companies";


export default class CompanyStorage extends LocalStorage {


	static #get (company_id) { return super.get (store_name, company_id) }
	static #set (values) { LocalStorage.set_store (store_name, values) }


	/**** Public Methods ****/


	static active_company_id () { return this.#get ("active_company") }
	static square_id () { return nested_value (this.active_company (), "square_id") }

	static company_selected () { return isset (this.active_company_id ()) }
	static paid_account () { return isset (this.square_id ()) }

	static set_active_company (value) { super.set_item (store_name, "active_company", value) }


	static add_companies (companies) {

		let company_list = CompanyStorage.get_all (store_name);
		
		if (is_null (companies)) return;
		if (not_array (companies)) companies = [companies];

		for (let company of companies) {

			let company_id = company.company_id;

			if (not_set (company_id)) continue;
			if (is_null (company_list)) company_list = {}
			if (isset (company_list [company_id])) continue;

			company_list [company_id] = {...company};
			delete company_list [company_id].company_id;

		}// for;

		CompanyStorage.#set (company_list);

	}// add_companies;


	static company_list () { 
		let result = LocalStorage.get_all (store_name);
		if (isset (result)) delete result.active_company;
		return result;
	}// company_list;

	
	static active_company () { 
		return nested_value (this.company_list (), this.active_company_id ());
	}// active_company;


	static company_count () {
		let companies = get_values (this.company_list ());
		return isset (companies) ? companies.length : 0;
	}// company_count;
	

	static company_name = () => { return nested_value (this.active_company (), "company_name") }
	

}// CompanyStorage;