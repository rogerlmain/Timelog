import { isset, is_object } from "classes/common";


export default class LocalStorage {

	static get_all (key) { 
		let items = localStorage.getItem (key);
		try {
			return JSON.parse (items);
		} catch (except) {
			return null;
		}// try;
	}// get_credentials;


	static get (key, name) {
		let items = this.get_all (key);
		return (isset (items) && isset (items [name]) ? items [name] : null);
	}// get;


}// LocalStorage;