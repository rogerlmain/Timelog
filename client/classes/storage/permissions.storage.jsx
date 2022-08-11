
import LocalStorage from "classes/local.storage";
import PermissionsModel from "client/classes/models/permissions.model";


const store = "permissions";


export const team_permissions = {
	create_client: 0,
}// toggled;


export default class OptionsStorage extends LocalStorage {


	static async set_permission (type, value) {
		let permissions = localStorage.getItem (store) ?? await PermissionsModel.get_permissions () ?? 0;
		permissions = value ? (permissions | (1 << type)) : (permissions & ~(1 << type));
		localStorage.setItem (store, permissions);
	}// set_permissions;
	

}// OptionsStorage;