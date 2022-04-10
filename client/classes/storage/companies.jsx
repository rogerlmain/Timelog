import LocalStorage from "classes/local.storage"

import { isset, is_null } from "classes/common";


const store_name = "companies";


export default class Companies extends LocalStorage {

	static set_active_company (value) { super.set_item (store_name, "active_company", value) }
	static set (values) { super.set_store (store_name, values) }


	/********/


	static active_company () { return this.get ("active_company") }
	static company_selected () { return isset (this.active_company ()) }
	static get (name) { return LocalStorage.get (store_name, name) }
	

	static list () { 
		let companies = LocalStorage.get_all (store_name);
		return isset (companies) ? companies.list : null;
	}// list;


	static selected () { 

		let companies = this.list ();
		let selected_id = this.get ("active_company");

		if (is_null (companies) || is_null (selected_id)) return null;
		for (let company of companies) {
			if (company.company_id == selected_id) return company;
		}// if;
		return null;
	}// selected;

	static active_company_id () {
		let active_company = this.selected ();
		return is_null (active_company) ? 0 : active_company.company_id;
	}// active_company_id;

}// Companies;