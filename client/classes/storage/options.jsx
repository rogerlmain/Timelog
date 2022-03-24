import LocalStorage from "classes/local.storage";
import { default_options, option_types } from "client/classes/types/constants";
import { is_null, isset, not_set } from "classes/common";


const store_name = "options";


export const log_entry_boundaries = {
	start: "start",
	end: "end"
}// log_entry_boundaries;


export default class Options extends LocalStorage {

	static get (name) { return super.get (store_name, name) }
	static set (name, value) { super.set_item (store_name, name, value) }

	static granularity = () => { 
		let result = parseInt (Options.get (option_types.granularity));
		return isNaN (result) ? default_options.granularity : (result);
	}/* granularity */;

	static rounding = (end) => {
		let result = Options.get (option_types [`${end}_rounding`]);
		return result;
	}// rounding;

}// Options;