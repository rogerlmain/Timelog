import LocalStorage from "classes/local.storage";
import { default_options, option_types, option_key } from "types/globals";
import { is_null, isset, not_set } from "classes/common";


const store_name = "options";


export const log_entry_boundaries = {
	start: "start",
	end: "end"
}// log_entry_boundaries;


export default class Options extends LocalStorage {

	static set (data) { super.set (store_name, data) }


	static get (option_id) {
		let options = this.get_all (store_name);
		if (is_null (options)) return null;
		for (let option of options) {
			if (not_set (option)) continue;
			if (option.id == option_id) return option.value;
		}// for;
		return null;
	}// get;


	static set_item (key, value) {
		let options = this.get_all (store_name);
		if (is_null (options)) options = [];
		for (let option of options) {
			if (isset (option) && (option.id == key)) option.value = value;
		}// for;
		super.set (store_name, options);
	}// set_item;


	static granularity = () => { 
		let result = parseInt (Options.get (option_types.granularity));
		return isNaN (result) ? default_options.granularity : (result);
	}/* granularity */;


	static rounding = (end) => {
		let result = Options.get (option_types [`${end}_rounding`]);
		return result;
	}// rounding;

}// Options;