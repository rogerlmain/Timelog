import * as common from "classes/common";

import { is_array, is_object, not_set } from "classes/common";


export default class LocalStorage {


	static get_all (key) { 
		let items = localStorage.getItem (key);
		try {
			return JSON.parse (items);
		} catch (except) {
			return null;
		}// try;
	}// get_credentials;


	static get (store, name) {
		let items = this.get_all (store);
		return (common.isset (items) && common.isset (items [name]) ? items [name] : null);
	}// get;


	static set_store (store, values) {
		if (is_array (values)) values.forEach (item => Object.keys (item).forEach (key => not_set (item [key]) && delete item [key]));
		localStorage.setItem (store, (is_array (values) || is_object (values)) ? JSON.stringify (values) : values);
	}// set_store;

	static remove_store = (store) => localStorage.removeItem (store);


	static set_item (store, name, value) {
		let values = this.get_all (store);
		if (common.is_null (values)) values = {};
		values [name] = value;
		this.set_store (store, values);
	}// set_item;



}// LocalStorage;