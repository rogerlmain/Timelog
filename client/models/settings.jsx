import Database from "classes/database";
import DataModel from "models/data.model";


export default class SettingsModel extends DataModel {


	static get_settings () {
		let parameters = new FormData ();
		parameters.append ("action", "get");
		return Database.fetch_data ("settings", parameters);
	}// get_settings;


	static save_setting (setting_id, value) {
		let parameters = new FormData ();
		parameters.append ("action", "save");
		parameters.append ("setting_id", setting_id);
		parameters.append ("value", value);
		return Database.fetch_data ("settings", parameters);
	}// save_setting;


}// SettingsModel;

