import Database from "../database.mjs";
import Cookies from "../cookies.mjs";


export default class AccountData extends Database {


	get_accounts_by_company = (company_id) => {
		let procedure = "call get_accounts_by_company (?)";
		let parameters = [company_id];
		this.data_query (procedure, parameters);
	}// get_accounts_by_company;


	get_accounts_by_project = (project_id) => {
		let procedure = "call get_accounts_by_project (?)";
		let parameters = [project_id];
		this.data_query (procedure, parameters);
	}// get_accounts_by_project;


	get_accounts_by_task = (task_id) => {
		let procedure = "call get_accounts_by_task (?)";
		let parameters = [task_id];
		this.data_query (procedure, parameters);
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

		this.data_query (procedure, parameters).then  (results => {
			if ((results == null) || (results [0].length != 1)) throw "Invalid data response: models.save_account";
			response.send ({ account_id: results[0][0].account_id });
		});

	}// save_account;


	signin = (fields, response) => {
		this.data_query ("get_account_by_credentials", [fields ["username"], fields ["password"]]).then (async results => {

			let account = (global.is_null (results) || (results.length > 1)) ? null : results [0];

			if (global.is_null (account)) throw "Invalid data response: models.signin";

			let result = { 
				credentials: account, 
				settings: await this.data_query ("get_account_settings", [account.account_id]),
				options: await this.data_query ("get_account_options", [account.company_id])
			};

			response.send (result);

			this.connection.end ();

		});
	}// signin;


}// AccountData;


