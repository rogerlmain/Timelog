import Database from "../database.mjs";
import Cookies from "../cookies.mjs";


class AccountData extends Database {


	current_account = () => {
		return JSON.parse (new Cookies ().get_cookie ("current_account"));
	}// current_account;


	get_accounts_by_company = (company_id) => {
		let procedure = "call get_accounts_by_company (?)";
		let parameters = [company_id];
		this.execute_query (procedure, parameters);
	}// get_accounts_by_company;


	get_accounts_by_project = (project_id) => {
		let procedure = "call get_accounts_by_project (?)";
		let parameters = [project_id];
		this.execute_query (procedure, parameters);
	}// get_accounts_by_project;


	get_accounts_by_task = (task_id) => {
		let procedure = "call get_accounts_by_task (?)";
		let parameters = [task_id];
		this.execute_query (procedure, parameters);
	}// get_accounts_by_task;


	save_account = (fields) => {
		
		const numeric_value = (fieldname) => {
			try {
				let value = parseInt (fields [fieldname]);
				return (isNaN (value) ? null : value);
			} catch (except) { return null } // value doesn't exist
		}/* numeric_value */;

		let procedure = "save_account";

		let parameters = [

			fields ["first_name"],
			fields ["last_name"],
			fields ["username"],
			fields ["email_address"],
			fields ["password"],

			numeric_value ("account_type"),
			numeric_value ("account_id")

		];

		this.execute_query (procedure, parameters).then  (results => {
			if ((results == null) || (results [0].length != 1)) throw "Invalid data response: models.save_account";
			response.cookie ("current_account", this.cookie_string (results [0]));
			response.send ({ account_id: results[0][0].account_id });
		});

	}// save_account;


	signin = async (fields) => {
		this.execute_query ("get_account_by_credentials", [fields ["username"], fields ["password"]]).then (results => {
			if ((results == null) || (results.length > 1)) throw "Invalid data response: models.signin";

let str = this.cookie_string (results);

			if (results.length == 1) response.cookie ("current_account", this.cookie_string (results), { encode: String });
		});
	}// signin;


	signed_in = () => {
		return this.cookies.get_cookie ("current_account") != null;
	}// signed_in;

	signed_out = () => {
		return this.cookies.get_cookie ("current_account") == null;
	}// signed_out */

}// AccountData;


export default AccountData;