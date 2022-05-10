import * as common from "classes/common";

import { is_array, is_object, is_empty } from "classes/common";


export default class LocalStorage {


	static stripped (object) {

		if (is_array (object)) object.forEach (item => object.replace (item, LocalStorage.stripped (item)));

		if (is_object (object)) Object.keys (object).forEach (key => { 
			if (is_empty (object [key])) delete object [key] 
			if (is_object (object [key]) || is_array (object [key])) object [key] = LocalStorage.stripped (object [key]);
		});

		return object;
		
	}// stripped;


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
		localStorage.setItem (store, (is_array (values) || is_object (values)) ? JSON.stringify (LocalStorage.stripped (values)) : values);
	}// set_store;

	static remove_store = (store) => localStorage.removeItem (store);


	static set_item (store, name, value) {
		let values = this.get_all (store);
		if (common.is_null (values)) values = {};
		values [name] = value;
		this.set_store (store, values);
	}// set_item;



}// LocalStorage;