import Database from "classes/database";
import DataModel from "models/data.model";


export default class AccountOptionsModel extends DataModel {


	static get_options () {
		let parameters = new FormData ();
		parameters.append ("action", "get");
		return Database.fetch_data ("account_options", parameters);
	}// get_options;


	static save_option (option_id, value) {
		let parameters = new FormData ();
		parameters.append ("action", "save");
		parameters.append ("option_id", option_id);
		parameters.append ("value", value);
		return Database.fetch_data ("account_options", parameters);
	}// save_option;


}// AccountOptionsModel;

