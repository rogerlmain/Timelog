import DataModel from "../models.mjs";
import Cookies from "../cookies.mjs";


class AccountData extends DataModel {


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


	save_account = () => {
		new multiparty.Form ().parse (request, (form_error, form_fields, files) => {
			let procedure = "call save_account (?, ?, ?, ?, ?, ?, ?)";

			let parameters = [
				form_fields ["first_name"][0],
				form_fields ["last_name"][0],
				form_fields ["username"][0],
				form_fields ["email_address"][0],
				form_fields ["password"][0],
				parseInt (form_fields ["account_type"][0]),
				(accounts.signed_in (request) ? form_fields ["account_id"][0] : null)
			];

			this.execute_query (procedure, parameters, (query_error, results, query_fields) => {
				if ((results == null) || (results [0].length != 1)) throw "Invalid data response: models.save_account";
				let response_string = JSON.stringify (results [0]).slice (1, -1);
				response.cookie ("current_account", response_string, { encode: String });
				response.send ({ account_id: results[0][0].account_id});
			});
		});
	}// save_account;


	signin = () => {
		new multiparty.Form ().parse (request, (form_error, form_fields, files) => {
			this.execute_query ("call get_account_by_credentials (?, ?)", [form_fields ["username"], form_fields ["password"]], (query_error, results, query_fields) => {
				if ((results == null) || (results [0].length > 1)) throw "Invalid data response: models.signin";
				if (results [0].length == 1) {
					let response_string = JSON.stringify (results [0]).slice (1, -1);
					response.cookie ("current_account", response_string, { encode: String });
				}// if;
				response.send ();
			});
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