import Database from "../database.mjs";


export default class AccountsModel extends Database {


	get_by_email = email_address => this.data_query ("get_account_by_email", [email_address]);
	get_by_id = account_id => this.execute_query ("get_account_by_id", [account_id]);
	
	get_by_company = company_id => this.execute_query ("get_accounts_by_company", [parseInt (company_id)]);
	get_by_project = project_id => this.execute_query ("get_accounts_by_project", [project_id]);
	get_by_task = task_id => this.execute_query ("get_accounts_by_task", [task_id]);

	signin = (fields, response) => { return this.data_query ("get_account_by_credentials", [fields ["email"], fields ["password"]])	}


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
			fields ["avatar"],

		];

		this.execute_query (procedure, parameters);

	}// save_account;


}// AccountsModel;

