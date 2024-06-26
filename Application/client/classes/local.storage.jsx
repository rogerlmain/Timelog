import * as common from "client/classes/common";

import { is_array, is_object, is_empty } from "client/classes/common";


export default class LocalStorage {


	static stripped (object) {

		if (is_array (object)) object.forEach (item => object.replace (item, LocalStorage.stripped (item)));

		object?.get_keys ()?.forEach (key => { 
			if (is_empty (object [key])) delete object [key] 
			if (is_object (object [key], true)) object [key] = LocalStorage.stripped (object [key]);
		});

		return object;
		
	}// stripped;


	static get_store (key) { 

		// Decrypt result (remember to encrypt the store name to retrieve the encrypted result)

		let items = localStorage.getItem (key);

		try {
			return JSON.parse (items);
		} catch (except) {
			return items;
		}// try;

	}// get_store;


	static get (store, name) {
		let items = LocalStorage.get_store (store);
		return (common.isset (items) && common.isset (items [name]) ? items [name] : null);
	}// get;


	static remove_store = store => localStorage.removeItem (store);
	static clear_store = LocalStorage.remove_store;


	static set_store (store, values) {
		// Encrypt store and values
		localStorage.setItem (store, (is_array (values) || is_object (values)) ? JSON.stringify (LocalStorage.stripped (values)) : values);
	}// set_store;

	
	static set_item (store, name, value) {
		let values = LocalStorage.get_store (store);
		if (common.is_null (values)) values = {};
		values [name] = value;
		LocalStorage.set_store (store, values);
	}// set_item;
	

}// LocalStorage;