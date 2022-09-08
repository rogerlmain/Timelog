import Database from "client/classes/database";
import AccountStorage from "client/classes/storage/account.storage";
import DataModel from "client/classes/models/data.model";
import CompanyStorage from "../storage/company.storage";


const table = "permissions";


export default class PermissionsModel extends DataModel {


	static get_permissions (account_id) {

		let parameters = new FormData ();

		parameters.set ("action", "get");
		parameters.set ("company_id", CompanyStorage.active_company_id ());
		parameters.set ("account_id", account_id);

		return Database.fetch_data (table, parameters);

	}// get_permissions;


	static set_permissions (account_id, permissions) {

		let parameters = new FormData ();

		parameters.set ("action", "set");
		parameters.set ("company_id", CompanyStorage.active_company_id ());
		parameters.set ("account_id", account_id);
		parameters.set ("permissions", permissions);

		return Database.fetch_data (table, parameters);
		
	}// set_permissions;


}// OptionsModel;
