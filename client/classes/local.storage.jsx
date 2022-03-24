import { isset, is_null, is_object } from "classes/common";


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
		return (isset (items) && isset (items [name]) ? items [name] : null);
	}// get;


	static set_store = (store, value) => { localStorage.setItem (store, is_object (value) ? JSON.stringify (value) : value) }


	static set_item (store, name, value) {
		let values = this.get_all (store);
		if (is_null (values)) values = [];
		values [name] = value;
		this.set_store (store, values);
	}// set_item;



}// LocalStorage;