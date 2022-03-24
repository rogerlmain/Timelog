import LocalStorage from "classes/local.storage"

import { isset } from "classes/common";


const store_name = "companies";


export default class Credentials extends LocalStorage {

	static get (name) { return LocalStorage.get (store_name, name) }
	static set (name, value) { super.set_item (store_name, name, value) }

	static list () { 
		let companies = LocalStorage.get_all (store_name);
		return isset (companies) ? companies.list : null;
	}// list;

}// Credentials;