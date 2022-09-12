import LocalStorage from "client/classes/local.storage";

import PermissionObject from "client/classes/types/permission.object";
import PermissionsModel from "client/classes/models/permissions.model";
import AccountStorage from "client/classes/storage/account.storage";

import ActivityLog from "client/classes/activity.log";

import { is_null, nested_value, not_null, not_set } from "client/classes/common";
import CompanyStorage from "./company.storage";


const store = "permissions";
const full_permission = 1125899906842623;


export const team_permissions = {
	create_client		:  0,
	create_project		:  1,
	create_reports		:  2,
	team_permission		:  3,
	purchase_permission	:  4,
	assign_clients		:  5,
	assign_projects		:  6,
}// toggled;


export default class PermissionsStorage extends LocalStorage {


	static #get (account_id, type) { 
		return new Promise ((resolve, reject) => {

			let permissions = LocalStorage.get_store (store);

			if (not_set (CompanyStorage.active_company_id ())) return resolve (0);
			if (not_null (permissions)) return resolve (new PermissionObject (permissions).get (type));

			PermissionsModel.get_permissions (account_id).then (result => {

				let permissions = (nested_value (result, 0, "permissions") ?? 0);

				LocalStorage.set_store (store, permissions);
				resolve (new PermissionObject (permissions).get (type));
				
			}).catch (reject);
			
		});
	}// #get;


	/********/


	static set_permission (account_id, type, value) {
		this.#get (account_id, type).then (permissions => {

			let permissions_object = new PermissionObject (permissions);

			(value == 1) ? permissions_object.set (type) : permissions_object.clear (type);
			PermissionsModel.set_permissions (account_id, permissions_object.permissions).then (() => LocalStorage.set_store (store, permissions_object.permissions));

		}).catch (ActivityLog.log_error);
	}// set_permissions;


	static client_permission = () => this.#get (AccountStorage.account_id (), team_permissions.create_client);
	static project_permission = () => this.#get (AccountStorage.account_id (), team_permissions.create_project);
	static team_permission = () => this.#get (AccountStorage.account_id (), team_permissions.team_permission);
	

}// PermissionsStorage;