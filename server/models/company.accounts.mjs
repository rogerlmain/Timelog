import Database from "../database.mjs";


export default class CompanyAccountsData extends Database {


	set_company_account = (account_id, company_id, permissions = null) => {

		let parameters = {
			account_id: global.integer_value (account_id),
			company_id: global.integer_value (company_id),
			permissions: global.integer_value (permissions),
		}// parameters;

		this.execute_query ("set_company_account", parameters);

	}// set_company_account;



}// CompanyAccountsData;

