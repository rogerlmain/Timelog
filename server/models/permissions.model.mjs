import Database from "../database.mjs";
import "../globals.mjs";


export default class PermissionsModel extends Database {

	get_permissions (company_id, account_id) { this.execute_query ("get_permissions", [account_id]) }
	set_permissions (company_id, account_id, permissions) { this.execute_query ("set_permissions", Array.from (arguments)) }

}/* PermissionsModel */;
