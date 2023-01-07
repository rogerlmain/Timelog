import LocalStorage from "client/classes/local.storage";
import { isset, is_object } from "client/classes/common";
import LoggingModel from "../models/logging.model";


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

	static logged_in = () => { return this.#get ("logged_in") }
	static logged_out = () => { return !this.logged_in () }

	static start_time = () => { return this.#get ("start_time") }
	static client_id = () => { return this.#get ("client_id") }
	static project_id = () => { return this.#get ("project_id") }


	static current_entry = () => { 

		let result = this.get_store ();

		if (isset (result) && isset (result.start_time)) result.start_time = new Date (result.start_time);
		return result;
		
	}/* current_entry */;


}// LoggingStorage;