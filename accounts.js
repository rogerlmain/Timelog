module.exports = function (request) {

	this.cookies = require ("./cookies")(request);

	return {

		current_account: () => {
			return JSON.parse (this.cookies.get_cookie ("current_account"));
		}/* current_account */,

		signed_in: () => {
			return this.cookies.get_cookie ("current_account") != null;
		}/* signed_in */,

		signed_out: () => {
			return this.cookies.get_cookie ("current_account") == null;
		}/* signed_out */

	}// return;

}// account;

