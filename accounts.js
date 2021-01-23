const cookies = require ("./cookies");

const account = {

	current_account: () => {
		return JSON.parse (cookies.get_cookie ("current_account"));
	}/* current_account */,

	signed_in: () => {
		return cookies.get_cookie ("current_account") != null;
	}/* signed_in */,

	signed_out: () => {
		return cookies.get_cookie ("current_account") == null;
	}/* signed_out */

}// account;

module.exports = account;