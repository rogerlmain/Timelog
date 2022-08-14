import LocalStorage from "client/classes/local.storage";

import PermissionObject from "client/classes/types/permission.object";
import PermissionsModel from "client/classes/models/permissions.model";
import AccountStorage from "client/classes/storage/account.storage";

import ActivityLog from "client/classes/activity.log";

import { nested_value, not_null } from "client/classes/common";


const store = "permissions";
const full_permission = 1125899906842623;


export const team_permissions = {
	create_client: 0,
}// toggled;


export default class PermissionsStorage extends LocalStorage {


	static #get (type) { 
		return new Promise ((resolve, reject) => {

			let permissions = LocalStorage.get_store (store);

			if (not_null (permissions)) return resolve (new PermissionObject (permissions).get (type));

			PermissionsModel.get_permissions ().then (result => {

				let permissions = (nested_value (result, 0, "permissions") ?? 0);

				super.set_store (store, permissions);
				resolve (new PermissionObject (permissions).get (type));
				
			}).catch (reject);
			
		});
	}// #get;


	/********/


	static set_permission (type, value) {
		this.#get (type).then (permissions => {
			let permissions_object = new PermissionObject (permissions);
			(value == 1) ? permissions_object.set (type) : permissions_object.clear (type);
			PermissionsModel.set_permissions (AccountStorage.account_id (), permissions_object.permissions).then (() => LocalStorage.set_store (store, permissions_object.permissions));
		}).catch (ActivityLog.log_error);
	}// set_permissions;


	static client_permission = () => this.#get (team_permissions.create_client)
	

}// PermissionsStorage;