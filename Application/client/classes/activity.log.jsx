import { boolean_value, is_boolean, multiline_text, notify } from "client/classes/common";


export default class ActivityLog {

	//	Verbose (boolean): determines
	//	whether the user will be informed

	static log_error (...parameters) {

		let verbose = false;

		if (is_boolean (parameters [parameters.length - 1])) {
			verbose = parameters [parameters.length];
			parameters = parameters.slice (0, parameters.length - 2);
		}// if;

		if (parameters.length == 1) parameters [0] = `Activity Log Error: ${parameters [0]}`;
		if (verbose) notify (multiline_text (parameters));

		console.log (multiline_text (parameters));

	}// log_error;

}// ActivityLog;