import Database from "../database.mjs";


export default class CompanyAccountsData extends Database {


	save_company_account = (data) => {

		let parameters = {
			account_id: global.integer_value (data.account_id),
			company_id: global.integer_value (data.company_id)
		}// parameters;

		this.execute_query ("save_company_account", parameters);

	}// save_company_account;



}// CompanyAccountsData;

