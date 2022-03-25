import LocalStorage from "classes/local.storage"

import { isset, is_null } from "classes/common";


const store_name = "companies";


export default class Accounts extends LocalStorage {

	static get (name) { return LocalStorage.get (store_name, name) }
	static set (name, value) { super.set_item (store_name, name, value) }

	static list () { 
		let companies = LocalStorage.get_all (store_name);
		return isset (companies) ? companies.list : null;
	}// list;


	static company_selected () { return isset (this.active_company ()) }


	static active_company () { return this.get ("active_company") }


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
		return is_null (active_company) ? null : active_company.company_id;
	}// active_company_id;

}// Accounts;