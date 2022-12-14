import Database from "client/classes/database";
import DataModel from "client/classes/models/data.model";


const table = "settings";


export default class SettingsModel extends DataModel {


	static get_settings () {
		let parameters = new FormData ();
		parameters.set ("action", "get");
		return Database.fetch_data (table, parameters);
	}// get_settings;


	static save_setting (setting_id, value) {
		let parameters = new FormData ();
		parameters.set ("action", "save");
		parameters.set ("setting_id", setting_id);
		parameters.set ("value", value);
		return Database.fetch_data (table, parameters);
	}// save_setting;


}// SettingsModel;

