import Database from "classes/database";
import DataModel from "models/data.model";

import * as common from "classes/common";


export default class AccountsModel extends DataModel {


	static fetch_by_company (company_id, callback) {
		let parameters = new FormData ();
		parameters.set ("action", "company");
		parameters.set ("company_id", company_id.toString ());
		Database.fetch_data ("accounts", parameters).then (callback);
	}// fetch_by_company;


	static fetch_by_project (project_id, callback = null) {
		if (common.is_null (project_id)) return null;
		let parameters = new FormData ();
		parameters.set ("action", "project");
		parameters.set ("project_id", project_id.toString ());
		Database.fetch_data ("accounts", parameters).then (() => DataModel.data_object (AccountsList, callback));
	}// fetch_by_project;


	static fetch_by_task (task_id, callback) {
		let parameters = new FormData ();
		parameters.set ("action", "task");
		parameters.set ("task_id", task_id.toString ());
		Database.fetch_data ("accounts", parameters).then (callback);
	}// fetch_by_task;


	static save_account (data) {
		data.append ("action", "save");
		return Database.save_data ("accounts", data);
	}// save_account;


}// AccountsModel;