import LocalStorage from "classes/local.storage";
import { isset } from "classes/common";


export default class Logging extends LocalStorage {

	static get_all = () => { return super.get_all ("logging") }

	static entry = () => { return this.get_all () }

	static logged_in = () => { return isset (this.entry ()) }

	static start_time = () => { return this.get ("logging", "start_time") }
	static client_name = () => { return this.get ("logging", "client_name") }
	static project_name = () => { return this.get ("logging", "project_name") }

}// Logging;