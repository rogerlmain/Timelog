import LocalStorage from "client/classes/local.storage";
import { isset, is_object } from "client/classes/common";


const store_name = "logging";


export default class LoggingStorage extends LocalStorage {


	static #get = field => {
		let result = this.get_store ();
		return is_object (result) ? result [field] : null;
	}/* #get */;


	/********/


	static get_store = () => LocalStorage.get_store (store_name);


	/********/


	static set = (value) => { return LocalStorage.set_store (store_name, value) }

	static delete = () => super.remove_store (store_name);	

	static logged_in = () => { return isset (this.get_store ()) }
	static logged_out = () => { return !this.logged_in () }

	static start_time = () => { return this.#get ("start_time") }
	static client_name = () => { return this.#get ("client_name") }
	static project_name = () => { return this.#get ("project_name") }


	static current_entry = () => { 
		let result = this.get_store ();
		if (isset (result) && isset (result.start_time)) result.start_time = new Date (result.start_time);
		return result;
	}// current_entry;


}// LoggingStorage;