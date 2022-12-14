import { null_value } from "client/classes/common";

export default class PermissionObject {

	permissions = null;

	constructor (permissions) { this.permissions = (null_value (permissions) ?? 0) }

	get (type) { return ((this.permissions & (1 << type)) != 0) }
	get_all () { return this.permissions }

	set (type) { this.permissions = (this.permissions | (1 << type)) }
	clear (type) { this.permissions = (this.permissions & ~(1 << type)) }

}// PermissionObject;