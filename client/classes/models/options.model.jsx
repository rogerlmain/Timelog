import Database from "classes/database";
import CompanyStorage from "client/classes/storage/company.storage";
import DataModel from "client/classes/models/data.model";


export default class OptionsModel extends DataModel {


	static get_options () {
		let parameters = new FormData ();
		parameters.set ("action", "get");
		return Database.fetch_data ("options", parameters);
	}// get_options;


	static save_option (option_id, value) {
		let parameters = new FormData ();
		parameters.set ("action", "save");
		parameters.set ("option_id", option_id);
		parameters.set ("company_id", CompanyStorage.active_company_id ());
		parameters.set ("value", value);
		return Database.fetch_data ("options", parameters);
	}// save_option;


}// OptionsModel;
