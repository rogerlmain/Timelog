import LocalStorage from "classes/local.storage";
import { isset, is_object } from "classes/common";


const store_name = "logging";


export default class LoggingStorage extends LocalStorage {


	static #get_all = () => { return super.get_all (store_name) }


	static #get = field => {
		let result = this.#get_all ();
		return is_object (result) ? result [field] : null;
	}// #get;


	/********/


	static set = (value) => { return super.set_store (store_name, value) }

	static delete = () => super.remove_store (store_name);	

	static logged_in = () => { return isset (this.#get_all ()) }
	static logged_out = () => { return !this.logged_in () }

	static start_time = () => { return this.#get ("start_time") }
	static client_name = () => { return this.#get ("client_name") }
	static project_name = () => { return this.#get ("project_name") }


	static current_entry = () => { 
		let result = this.#get_all ();
		if (isset (result) && isset (result.start_time)) result.start_time = new Date (result.start_time);
		return result;
	}// current_entry;


}// LoggingStorage;