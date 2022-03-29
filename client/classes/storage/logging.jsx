import LocalStorage from "classes/local.storage";
import { isset } from "classes/common";


const store_name = "logging";


export default class Logging extends LocalStorage {

	static get = (name) => { return super.get (store_name, name) }
	static get_all = () => { return super.get_all (store_name) }

	static entry = () => { return this.get_all () }

	static logged_in = () => { return isset (this.entry ()) }

	static set = (name, value) => { return super.set (store_name, name, value) }

	static start_time = () => { return this.get ("start_time") }
	static client_name = () => { return this.get ("client_name") }
	static project_name = () => { return this.get ("project_name") }

}// Logging;