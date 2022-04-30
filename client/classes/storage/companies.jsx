import * as common from "classes/common";

import LocalStorage from "classes/local.storage"


const store_name = "companies";


export default class Companies extends LocalStorage {


	static set_active_company (value) { super.set_item (store_name, "active_company", value) }
	static set (values) { super.set_store (store_name, values) }


	/********/


	static get (name) { return LocalStorage.get (store_name, name) }

	static active_company_id () { return this.get ("active_company") }
	static square_id () { return common.nested_value (this.active_company (), "square_id") }

	static company_selected () { return common.isset (this.active_company_id ()) }
	static paid_account () { return common.isset (this.square_id ()) }

	static active_company () { 
		return common.nested_value (this.company_list (), this.active_company_id ());
	}// active_company;


	static company_count () { 
		let companies = this.company_ids ();
		return (common.isset (companies) ? companies.length : 0);
	}// company_count;
	
	static company_ids () { 
		let companies = LocalStorage.get_all (store_name);
		let keys = common.is_object (companies) ? Object.keys (companies) : null;
		return common.is_object (keys) ? keys.filter (item => common.is_number (item)) : null;
	}// company_ids;


	static company_list () {

		let result = null;
		let companies = LocalStorage.get_all (store_name);
		let ids = this.company_ids ();

		if (common.is_null (ids)) return result;

		for (let company_id of ids) {
			if (common.is_null (result)) result = {}
			result [company_id] = companies [company_id];
		}// for;

		return result;

	}// company_list;


}// Companies;