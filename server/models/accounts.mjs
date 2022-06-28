import Database from "../database.mjs";
import OptionsData from "./options.mjs";
import SettingsData from "./settings.mjs";
import CompanyData from "./companies.mjs";
import LoggingData from "./logging.mjs";


export default class AccountData extends Database {


	get_accounts_by_company = company_id => {
		let procedure = "get_accounts_by_company";
		let parameters = [company_id];
		return this.data_query (procedure, parameters);
	}// get_accounts_by_company;


	get_accounts_by_project = project_id => {
		let procedure = "get_accounts_by_project";
		let parameters = [project_id];
		return this.data_query (procedure, parameters);
	}// get_accounts_by_project;


	get_accounts_by_task = task_id => {
		let procedure = "get_accounts_by_task";
		let parameters = [task_id];
		return this.data_query (procedure, parameters);
	}// get_accounts_by_task;


	get_account_by_email = email_address => { return this.data_query ("get_account_by_email", [email_address]) }


	/********/


	save_account = (fields) => {
		
		let procedure = "save_account";

		let parameters = [
			
			fields ["account_id"],

			fields ["first_name"],
			fields ["last_name"],
			fields ["friendly_name"],
			fields ["email_address"],
			fields ["password"],

			fields ["account_type"],

		];

		this.execute_query (procedure, parameters);

	}// save_account;


	signin = (fields, response) => { return this.data_query ("get_account_by_credentials", [fields ["email"], fields ["password"]])	}


}// AccountData;

