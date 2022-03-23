import Database from "../database.mjs";
import AccountOptionsData from "./options.mjs";
import AccountSettingsData from "./settings.mjs";
import LoggingData from "./logging.mjs";


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

			fields ["square_id"],
			
			numeric_value ("account_type"),
			numeric_value ("account_id")

		];

		this.data_query (procedure, parameters);

	}// save_account;


	signin = (fields, response) => {
		this.data_query ("get_account_by_credentials", [fields ["username"], fields ["password"]]).then (async results => {

			global.account = (global.is_null (results) || (results.length > 1)) ? null : results [0];

			if (global.is_null (account)) throw "Invalid data response: models.signin";

			let result = { 
				credentials: account, 
				settings: await (new AccountSettingsData ().get_settings ()),
				options: await (new AccountOptionsData ().get_options ()),
				logging: (await (new LoggingData ().latest_log_entry ())) [0]
			};

			response.send (result);

			this.connection.end ();

		});
	}// signin;


}// AccountData;

