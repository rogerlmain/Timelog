import Database from "../database.mjs";


export default class SettingsData extends Database {


	get_settings = (account_id) => { 
		let result = this.data_query ("get_settings", [account_id], true);
		return result;
	}/* get_settings */;


	save_setting (account_id, setting_id, value) {

		let procedure = "save_setting";
		let parameters = [account_id, setting_id, value];

		this.execute_query (procedure, parameters);

	}/* save_setting */;


}/* SettingsData */;
