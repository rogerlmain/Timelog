import Database from "client/classes/database";
import DataModel from "client/classes/models/data.model";

import AccountStorage from "client/classes/storage/account.storage";

import { is_null } from "client/classes/common";


const table = "accounts";


export default class AccountsModel extends DataModel {


	static get_by_company (company_id) {
		let parameters = new FormData ();
		parameters.set ("action", "company");
		parameters.set ("company_id", parseInt (company_id));
		return Database.fetch_data (table, parameters);
	}// get_by_company;


	static get_by_email (email_address) {

		if (is_null (email_address)) return null;

		let parameters = new FormData ();

		parameters.set ("action", "email");
		parameters.set ("email_address", email_address);

		return Database.fetch_data (table, parameters);

	}// get_by_email;


	static get_by_project (project_id, callback = null) {
		if (is_null (project_id)) return null;
		let parameters = new FormData ();
		parameters.set ("action", "project");
		parameters.set ("project_id", project_id.toString ());
		Database.fetch_data (table, parameters).then (() => DataModel.data_object (AccountsList, callback));
	}// get_by_project;


	static save_account (form_data) {
		form_data.append ("action", "save");
		return Database.save_data (table, form_data);
	}// save_account;


	static save_password (form_data) {
		let data = new FormData ();
		data.append ("action", "save");
		data.append ("account_id", AccountStorage.account_id ());
		data.append ("password", form_data.get ("password"));
		return Database.save_data (table, data);
	}// save_password;


}// AccountsModel;