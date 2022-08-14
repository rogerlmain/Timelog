export default class PermissionObject {

	permissions = null;

	constructor (permissions) { this.permissions = permissions }

	get (type) { return (this.permissions & (1 << type) != 0) }
	get_all () { return this.permissions }

	set (type) { this.permissions = (this.permissions | (1 << type)) }
	clear (type) { this.permissions = (this.permissions & ~(1 << type)) }

}// PermissionObject;