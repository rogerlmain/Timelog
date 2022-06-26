import * as common from "classes/common";

import LocalStorage from "classes/local.storage"

import { isset, get_values } from "classes/common";


const store_name = "companies";


export default class CompanyStorage extends LocalStorage {


	static set_active_company (value) { super.set_item (store_name, "active_company", value) }
	static set (values) { super.set_store (store_name, values) }


	/********/


	static active_company_id () { return this.get ("active_company") }
	static square_id () { return common.nested_value (this.active_company (), "square_id") }

	static company_selected () { return common.isset (this.active_company_id ()) }
	static paid_account () { return common.isset (this.square_id ()) }


	static get (company_id) { return LocalStorage.get (store_name, company_id) }

	
	static company_list () { 
		let result = LocalStorage.get_all (store_name);
		if (isset (result)) delete result.active_company;
		return result;
	}// company_list;

	
	static active_company () { 
		return common.nested_value (this.company_list (), this.active_company_id ());
	}// active_company;


	static company_count () {
		let companies = get_values (this.company_list ());
		return common.isset (companies) ? companies.length : 0;
	}// company_count;
	

	static company_name = () => { return common.nested_value (this.active_company (), "company_name") }
	

}// CompanyStorage;