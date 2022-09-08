import Database from "client/classes/database";


const table = "company_accounts";


export default class CompanyAccountsModel {

	static set_company_account (data) {
		data.append ("action", "save");
		return Database.save_data (table, data);
	}// set_company_account;
	
}// CompanyAccountsModel;