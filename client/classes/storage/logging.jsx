import LocalStorage from "classes/local.storage";
import { isset } from "classes/common";


const store_name = "logging";


export default class Logging extends LocalStorage {

	static get = () => { return super.get_all (store_name) }
	static set = (value) => { return super.set_store (store_name, value) }
	static delete = () => super.remove_store (store_name);	

	static logged_in = () => { return isset (this.entry ()) }

	static start_time = () => { return this.get ("start_time") }
	static client_name = () => { return this.get ("client_name") }
	static project_name = () => { return this.get ("project_name") }

}// Logging;