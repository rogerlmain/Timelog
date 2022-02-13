import Database from "classes/database";
import DataModel from "models/data.model";

import * as common from "classes/common";


export class AccountItem {
	account_id: number;
	first_name: string;
	last_name: string;
	username: string;
	email_address: string;
	account_type: number;
	administrator_type: number;
	role_id: number;
}// AccountItem;


export class AccountsList extends Array<AccountItem> {};


export default class AccountsModel extends DataModel {


	public static fetch_by_company (company_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("action", "company");
		parameters.append ("company_id", company_id.toString ());
		Database.fetch_data ("accounts", parameters).then (callback);
	}// fetch_by_company;


	public static fetch_by_project (project_id: number, callback: Function = null): any {
		if (common.is_null (project_id)) return null;
		let parameters = new FormData ();
		parameters.append ("action", "project");
		parameters.append ("project_id", project_id.toString ());
		Database.fetch_data ("accounts", parameters).then (() => DataModel.data_object (AccountsList, callback));
	}// fetch_by_project;


	public static fetch_by_task (task_id: number, callback: any) {
		let parameters = new FormData ();
		parameters.append ("action", "task");
		parameters.append ("task_id", task_id.toString ());
		Database.fetch_data ("accounts", parameters).then (callback);
	}// fetch_by_task;


	public static save_account (data: FormData, callback: any) {
		data.append ("action", "save");
		Database.save_data ("accounts", data).then (callback);
	}// save_account;


}// AccountsModel;

