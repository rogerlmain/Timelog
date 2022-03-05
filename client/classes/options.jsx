import LocalStorage from "classes/local.storage";
import { default_options, option_types } from "types/globals";
import { is_null, not_set } from "classes/common";


export default class Options extends LocalStorage {

	static get (option_id) {
		let options = this.get_all ("options");
		if (is_null (options)) return null;
		for (let option of options) {
			if (not_set (option)) continue;
			if (option.id == option_id) return option.value;
		}// for;
		return null;
	}// get;

	static granularity = () => { return Options.get (option_types.granularity ?? default_options.granularity) };

}// Options;