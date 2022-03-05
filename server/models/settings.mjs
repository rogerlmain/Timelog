import Database from "../database.mjs";


export default class AccountSettingsData extends Database {


	get_settings = () => this.execute_query ("get_account_settings", [global.account.account_id]);


	save_setting (setting_id, value) {

		let procedure = "save_account_setting";
		let parameters = [global.account_id, setting_id, value];

		this.execute_query (procedure, parameters);

	}/* save_setting */;


}/* AccountSettingsData */;
 