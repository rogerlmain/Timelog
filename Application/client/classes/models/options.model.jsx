import Database from "client/classes/database";
import CompanyStorage from "client/classes/storage/company.storage";
import DataModel from "client/classes/models/data.model";


const table = "options";


export default class OptionsModel extends DataModel {


	static get_options_by_company (company_id) {
		let parameters = new FormData ();
		parameters.set ("action", "company");
		parameters.set ("company_id", company_id);
		return Database.fetch_data (table, parameters);
	}// get_options_by_company;


	static save_option (option_id, value) {
		let parameters = new FormData ();
		parameters.set ("action", "save");
		parameters.set ("option_id", option_id);
		parameters.set ("company_id", CompanyStorage.active_company_id ());
		parameters.set ("value", value);
		return Database.fetch_data (table, parameters);
	}// save_option;


}// OptionsModel;
